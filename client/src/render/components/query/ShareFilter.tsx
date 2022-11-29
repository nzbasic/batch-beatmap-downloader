import React from 'react';
import { compress, decompress, Compressed } from 'compress-json'
import { Node, Group } from "../../../models/filter";
import Button from '../util/Button';
import { toast } from 'react-toastify';

interface PropTypes {
  tree: Node
  updateTree: (tree: Group) => void;
}

export const ShareFilter = ({ tree, updateTree }: PropTypes) => {
  const copyTree = async () => {
    try {
      const compressed = compress(tree);
      const base64 = window.btoa(JSON.stringify(compressed));
      await navigator.clipboard.writeText(base64)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Failed to copy filter to clipboard')
    }
  };

  const loadTree = async () => {
    try {
      const content = await navigator.clipboard.readText()
      if (!content) return toast.error('No content in clipboard')

      const string = window.atob(content);
      const object = JSON.parse(string) as Compressed;
      const decompressed = decompress(object) as Node;
      if (!decompressed.group) throw new Error()

      updateTree(decompressed.group);
      toast.success('Loaded filter from clipboard')
    } catch {
      toast.error('Failed to load filter from clipboard')
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={copyTree}>Copy Filter</Button>
      <Button onClick={loadTree}>Paste Filter</Button>
    </div>
  )
};
