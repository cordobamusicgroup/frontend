import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import LinkUnlinkedReportForm from "@/components/admin/reports/unlinked/molecules/LinkUnlinkedReportForm";
import { useAppStore } from "@/lib/zustand/zustandStore";

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
  const [loading, setLoading] = useState(false);
  const { setNotification } = useAppStore.notification();

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Link Unlinked Report</DialogTitle>
      <DialogContent>
        <LinkUnlinkedReportForm
          reportId={reportId}
          onClose={() => {
            setLoading(false);
            onClose();
          }}
          reportData={reportData}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkReportDialog;
