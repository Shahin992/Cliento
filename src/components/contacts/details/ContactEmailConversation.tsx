import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';

type ConversationMessage = {
  id: number;
  role: 'sender' | 'receiver';
  subject: string;
  from: string;
  to: string;
  text: string;
  day: string;
  time: string;
};

type ContactEmailConversationProps = {
  messages: ReadonlyArray<ConversationMessage>;
};

const mutedText = '#7e8796';

const ContactEmailConversation = ({ messages }: ContactEmailConversationProps) => (
  <Box
    sx={{
      position: 'relative',
      border: '1px solid #dde5f3',
      borderRadius: 3,
      overflow: 'hidden',
      background:
        'radial-gradient(circle at 10% 0%, rgba(109,40,255,0.12) 0%, rgba(109,40,255,0) 32%), linear-gradient(180deg, #f8fbff 0%, #f4f7ff 100%)',
      '&::after': {
        content: '""',
        position: 'absolute',
        right: -70,
        top: -70,
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(59,130,246,0) 72%)',
        pointerEvents: 'none',
      },
    }}
  >
    <Box
      sx={{
        px: { xs: 1.25, sm: 1.75 },
        py: 1.2,
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: 14, letterSpacing: 0.2 }}>
          Email conversation
        </Typography>
        <Typography sx={{ fontSize: 12, color: mutedText }}>{messages.length} messages in thread</Typography>
      </Box>
      <Stack direction="row" spacing={0.8}>
        <Chip
          size="small"
          label="Email only"
          sx={{
            height: 24,
            fontWeight: 700,
            bgcolor: '#eef2ff',
            color: '#4338ca',
            border: '1px solid #dbe4ff',
          }}
        />
        <Chip
          size="small"
          label="Live thread"
          sx={{
            height: 24,
            fontWeight: 700,
            bgcolor: '#ecfdf3',
            color: '#047857',
            border: '1px solid #bbf7d0',
          }}
        />
      </Stack>
    </Box>

    <Stack spacing={1.25} sx={{ p: { xs: 1.1, sm: 1.5 }, position: 'relative', zIndex: 1 }}>
      {messages.map((message) => {
        const isSender = message.role === 'sender';

        return (
          <Box key={message.id}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.65 }}>
              <Typography
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#64748b',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #dbe4ef',
                  borderRadius: 999,
                  px: 0.9,
                  py: 0.2,
                }}
              >
                {message.day} • {message.time}
              </Typography>
            </Box>
            <Stack direction={isSender ? 'row-reverse' : 'row'} spacing={1} sx={{ alignItems: 'flex-end' }}>
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: isSender ? '#e9ddff' : '#e5eefc',
                  color: isSender ? '#5b21b6' : '#1d4ed8',
                }}
              >
                {isSender ? 'You' : 'NW'}
              </Avatar>
              <Box sx={{ maxWidth: { xs: '84%', sm: '74%' } }}>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: mutedText,
                    mb: 0.4,
                    textAlign: isSender ? 'right' : 'left',
                    px: 0.4,
                    fontWeight: 600,
                  }}
                >
                  {isSender ? 'Outgoing email' : 'Incoming email'}
                </Typography>
                <Box
                  sx={{
                    px: 1.4,
                    py: 1.15,
                    borderRadius: 2.6,
                    borderTopRightRadius: isSender ? 0.7 : 2.6,
                    borderTopLeftRadius: isSender ? 2.6 : 0.7,
                    bgcolor: isSender ? '#6d28ff' : '#ffffff',
                    background: isSender
                      ? 'linear-gradient(135deg, #7c3aed 0%, #6d28ff 60%, #5b21b6 100%)'
                      : 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
                    color: isSender ? 'white' : '#0f172a',
                    border: isSender ? 'none' : '1px solid #dde5f0',
                    boxShadow: isSender
                      ? '0 12px 28px rgba(91, 33, 182, 0.26)'
                      : '0 12px 24px rgba(15, 23, 42, 0.07)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: isSender
                        ? '0 14px 30px rgba(91, 33, 182, 0.3)'
                        : '0 14px 26px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 12.3, fontWeight: 700, mb: 0.65 }}>{message.subject}</Typography>
                  <Typography sx={{ fontSize: 11, opacity: isSender ? 0.9 : 0.82, mb: 0.15 }}>
                    <Box component="span" sx={{ fontWeight: 700, mr: 0.4 }}>
                      From:
                    </Box>
                    {message.from}
                  </Typography>
                  <Typography sx={{ fontSize: 11, opacity: isSender ? 0.9 : 0.82, mb: 0.65 }}>
                    <Box component="span" sx={{ fontWeight: 700, mr: 0.4 }}>
                      To:
                    </Box>
                    {message.to}
                  </Typography>
                  <Typography sx={{ fontSize: 13.2, lineHeight: 1.5 }}>{message.text}</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  </Box>
);

export default ContactEmailConversation;
