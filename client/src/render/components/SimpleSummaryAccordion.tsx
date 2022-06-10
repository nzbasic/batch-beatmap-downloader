import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  title: string
  expanded?: true
}

export const SimpleSummaryAccordion: React.FC<Props>= ({ title, expanded, children }) => {
  return (
    <Accordion defaultExpanded={expanded} >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className="dark:text-white" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        className="dark:bg-monokai-dark"
      >
        <span className="dark:text-white">{title}</span>
      </AccordionSummary>
      <AccordionDetails className="dark:bg-monokai-dark dark:text-white">
        {children}
      </AccordionDetails>
    </Accordion>
  )
}
