import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import LinkUnlinkedReportForm from "@/components/admin/reports/unlinked/molecules/LinkUnlinkedReportForm";

interface LinkReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportId: number | null;
  reportData: {
    id: number;
    labelName: string;
    distributor: string;
    reportingMonth: string;
    count: number;
  } | null;
}

const LinkReportDialog: React.FC<LinkReportDialogProps> = ({ open, onClose, reportId, reportData }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Link Unlinked Report</DialogTitle>
      <DialogContent>
        <LinkUnlinkedReportForm reportId={reportId} onClose={onClose} reportData={reportData} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkReportDialog;