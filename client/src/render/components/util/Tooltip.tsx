import QuestionMark from '@mui/icons-material/QuestionMark';
import MUITooltip from '@mui/material/Tooltip';

interface TooltipProps {
  title: string;
}

export const Tooltip = ({ title }: TooltipProps) => (
  <MUITooltip title={title}>
    <QuestionMark className="bg-sky-500 rounded-full p-1 ml-2" />
  </MUITooltip>
);
