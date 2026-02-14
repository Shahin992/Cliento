import { Stack, Typography } from '@mui/material';

import BasicInput from '../../../common/BasicInput';
import CustomModal from '../../../common/CustomModal';

type MarkLostDealModalProps = {
  open: boolean;
  lostReason: string;
  onLostReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  errorMessage?: string | null;
};

const MarkLostDealModal = ({
  open,
  lostReason,
  onLostReasonChange,
  onClose,
  onSubmit,
  submitDisabled = false,
  errorMessage = null,
}: MarkLostDealModalProps) => (
  <CustomModal
    open={open}
    handleClose={onClose}
    handleSubmit={onSubmit}
    submitDisabled={submitDisabled}
    title="Mark Deal as Lost"
    description="Tell us why this deal was lost."
    submitButtonText="Save Reason"
  >
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: 13, color: '#64748b' }}>
        This reason will help your team track why opportunities are dropped.
      </Typography>
      <BasicInput
        fullWidth
        multiline
        minRows={3}
        height="auto"
        placeholder="Lost reason"
        value={lostReason}
        onChange={(event) => onLostReasonChange(event.target.value)}
        sx={{ alignItems: 'flex-start', py: 1 }}
      />
      {errorMessage ? (
        <Typography sx={{ fontSize: 13, color: '#dc2626' }}>{errorMessage}</Typography>
      ) : null}
    </Stack>
  </CustomModal>
);

export default MarkLostDealModal;
