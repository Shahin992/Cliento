import { CloseOutlined } from '@mui/icons-material';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import BasicInput from '../../common/BasicInput';
import BasicSelect from '../../common/BasicSelect';
import { CustomButton } from '../../common/CustomButton';
import { CustomIconButton } from '../../common/CustomIconButton';
import TinyCloudEditor from '../../common/TinyCloudEditor';
import type { SendGoogleMailPayload } from '../../hooks/mail/useMailMutations';

interface EmailComposerDrawerProps {
  contactId: string;
  open: boolean;
  title?: string;
  subtitle?: string;
  fromEmails: string[];
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: SendGoogleMailPayload) => Promise<void> | void;
}

const borderColor = '#e2e8f0';
const mutedText = '#64748b';
const emailPattern = /\S+@\S+\.\S+/;

const htmlToPlainText = (html: string) => {
  if (!html.trim()) {
    return '';
  }

  const normalizedHtml = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<h[1-6][^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n');

  const doc = new DOMParser().parseFromString(normalizedHtml, 'text/html');
  return (doc.body.textContent || '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .trim();
};

const EmailComposerDrawer = ({
  contactId,
  open,
  title = 'Compose Email',
  subtitle = 'Draft an email with a connected mailbox.',
  fromEmails,
  initialTo = '',
  initialSubject = '',
  initialBody = '',
  isSubmitting = false,
  onClose,
  onSubmit,
}: EmailComposerDrawerProps) => {
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [errors, setErrors] = useState<{
    from?: string;
    to?: string;
    subject?: string;
  }>({});

  const fromOptions = useMemo(
    () => fromEmails.map((email) => ({ title: email, id: email })),
    [fromEmails]
  );

  const toList = useMemo(
    () =>
      toEmail
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [toEmail]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setFromEmail((previous) => {
      if (previous && fromEmails.includes(previous)) {
        return previous;
      }

      return fromEmails[0] ?? '';
    });
    setToEmail(initialTo);
    setSubject(initialSubject);
    setBody(initialBody);
    setErrors({});
  }, [open, fromEmails, initialTo, initialSubject, initialBody]);

  const handleSubmit = async () => {
    const nextErrors: { from?: string; to?: string; subject?: string } = {};

    if (!fromEmail.trim()) {
      nextErrors.from = 'Select a connected email.';
    }

    if (toList.length === 0) {
      nextErrors.to = 'Enter at least one recipient email.';
    } else if (toList.some((email) => !emailPattern.test(email))) {
      nextErrors.to = 'Enter valid recipient email addresses.';
    }

    if (!subject.trim()) {
      nextErrors.subject = 'Subject is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    await onSubmit({
      contactId,
      to: toList,
      from: fromEmail.trim(),
      subject: subject.trim(),
      body: htmlToPlainText(body),
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 560, lg: 620 },
          maxWidth: '100%',
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 2,
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: 'white',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{title}</Typography>
            <Typography sx={{ color: mutedText, fontSize: 13, mt: 0.5 }}>{subtitle}</Typography>
          </Box>
          <CustomIconButton
            size="small"
            onClick={onClose}
            customColor="#475569"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: `1px solid ${borderColor}`,
              backgroundColor: '#fff',
            }}
          >
            <CloseOutlined sx={{ fontSize: 18 }} />
          </CustomIconButton>
        </Stack>

        <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, sm: 2.5 }, py: 2.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 0.75 }}>From</Typography>
            <BasicSelect
              options={fromOptions}
              value={fromEmail}
              onChange={(event) => setFromEmail(String(event.target.value || ''))}
              defaultText="Select connected email"
              mapping={{ label: 'title', value: 'id' }}
              fullWidth
            />
            {errors.from ? (
              <Typography sx={{ color: '#dc2626', fontSize: 12, mt: 0.75 }}>{errors.from}</Typography>
            ) : null}
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 0.75 }}>To</Typography>
            <BasicInput
              fullWidth
              type="email"
              value={toEmail}
              onChange={(event) => setToEmail(event.target.value)}
              placeholder="contact@example.com"
            />
            <Typography sx={{ color: errors.to ? '#dc2626' : mutedText, fontSize: 12, mt: 0.75 }}>
              {errors.to || 'Use commas to send to multiple recipients.'}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 0.75 }}>Subject</Typography>
            <BasicInput
              fullWidth
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Write a subject"
            />
            {errors.subject ? (
              <Typography sx={{ color: '#dc2626', fontSize: 12, mt: 0.75 }}>{errors.subject}</Typography>
            ) : null}
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 0.75 }}>Body</Typography>
            <TinyCloudEditor value={body} onChange={setBody} minHeight={280} />
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          spacing={1}
          justifyContent="flex-end"
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.75,
            borderTop: `1px solid ${borderColor}`,
            backgroundColor: 'white',
          }}
        >
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ borderRadius: 999, textTransform: 'none', px: 2.5, width: { xs: '100%', sm: 'auto' } }}
          >
            Close
          </CustomButton>
          <CustomButton
            variant="contained"
            customColor="#2563eb"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            sx={{ borderRadius: 999, textTransform: 'none', px: 2.5, width: { xs: '100%', sm: 'auto' } }}
          >
            {isSubmitting ? 'Sending...' : 'Send Email'}
          </CustomButton>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default EmailComposerDrawer;
