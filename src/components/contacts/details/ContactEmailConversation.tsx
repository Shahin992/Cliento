import { Avatar, Box, CircularProgress, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

type ConversationMessage = {
  id: string | number;
  role: 'sender' | 'receiver';
  avatarSrc?: string | null;
  avatarLabel: string;
  subject: string;
  from: string;
  to: string;
  text: string;
  day: string;
  time: string;
};

type ContactEmailConversationProps = {
  messages: ReadonlyArray<ConversationMessage>;
  isInitialLoading?: boolean;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  hasNextPage?: boolean;
  errorMessage?: string | null;
  onLoadMore?: () => void;
};

const mutedText = '#7e8796';

const LoadingCard = () => (
  <Box
    sx={{
      px: 1.4,
      py: 1.2,
      borderRadius: 2.2,
      bgcolor: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
    }}
  >
    <Skeleton variant="text" width="42%" height={18} />
    <Skeleton variant="text" width="68%" height={16} />
    <Skeleton variant="text" width="56%" height={16} />
    <Skeleton variant="text" width="90%" height={20} />
    <Skeleton variant="text" width="78%" height={20} />
  </Box>
);

const ContactEmailConversation = ({
  messages,
  isInitialLoading = false,
  isRefreshing = false,
  isLoadingMore = false,
  hasNextPage = false,
  errorMessage = null,
  onLoadMore,
}: ContactEmailConversationProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreAnchorRef.current || !onLoadMore || !hasNextPage || isInitialLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '180px 0px',
        threshold: 0,
      }
    );

    observer.observe(loadMoreAnchorRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isInitialLoading, isLoadingMore, onLoadMore]);

  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid #dbe3f0',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f8fbff 0%, #f3f7fd 100%)',
        '&::after': {
          content: '""',
          position: 'absolute',
          right: -70,
          top: -70,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.11) 0%, rgba(37, 99, 235, 0) 72%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          px: { xs: 1.25, sm: 1.75 },
          py: 1.05,
          borderBottom: '1px solid #dde5ef',
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(6px)',
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
      </Box>

      {isRefreshing && !isInitialLoading ? (
        <Stack
          direction="row"
          spacing={0.7}
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 0.55,
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: 'rgba(255,255,255,0.75)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <CircularProgress size={13} />
          <Typography sx={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>
            Refreshing conversation...
          </Typography>
        </Stack>
      ) : null}

      <Box
        ref={scrollContainerRef}
        sx={{
          position: 'relative',
          zIndex: 1,
          height: { xs: '54vh', md: '58vh' },
          minHeight: 320,
          maxHeight: 620,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Stack spacing={1.1} sx={{ p: { xs: 1.1, sm: 1.5 } }}>
          {isInitialLoading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : null}

          {!isInitialLoading && errorMessage ? (
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid #fecaca',
                backgroundColor: '#fff1f2',
                px: 1.25,
                py: 1,
              }}
            >
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#b91c1c' }}>
                Could not load conversations
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#9f1239', mt: 0.3 }}>{errorMessage}</Typography>
            </Box>
          ) : null}

          {!isInitialLoading && !errorMessage && messages.length === 0 ? (
            <Box
              sx={{
                borderRadius: 2,
                border: '1px dashed #d5deee',
                bgcolor: 'rgba(255,255,255,0.74)',
                px: 1.35,
                py: 2,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: '#0f172a', fontSize: 13, fontWeight: 700 }}>
                No email conversation yet
              </Typography>
              <Typography sx={{ color: mutedText, fontSize: 12, mt: 0.5 }}>
                Emails with this contact will appear here once available.
              </Typography>
            </Box>
          ) : null}

          {!isInitialLoading &&
            !errorMessage &&
            messages.map((message) => {
              const isSender = message.role === 'sender';

              return (
                <Box key={message.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                    <Typography
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: '#475569',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #d8e1ec',
                        borderRadius: 999,
                        px: 1,
                        py: 0.25,
                      }}
                    >
                      {message.day} • {message.time}
                    </Typography>
                  </Box>
                  <Stack direction={isSender ? 'row-reverse' : 'row'} spacing={0.85} sx={{ alignItems: 'flex-end' }}>
                    <Avatar
                      src={message.avatarSrc || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: isSender ? '#e3ecff' : '#e9f2ff',
                        color: isSender ? '#1e40af' : '#1d4ed8',
                        border: '1px solid #d8e2f0',
                      }}
                    >
                      {message.avatarLabel}
                    </Avatar>
                    <Box sx={{ maxWidth: { xs: '86%', sm: '76%' } }}>
                      <Box
                        sx={{
                          px: 1.35,
                          py: 1.05,
                          borderRadius: 2.2,
                          borderTopRightRadius: isSender ? 0.65 : 2.2,
                          borderTopLeftRadius: isSender ? 2.2 : 0.65,
                          bgcolor: isSender ? '#1d4ed8' : '#ffffff',
                          background: isSender
                            ? 'linear-gradient(140deg, #2563eb 0%, #1d4ed8 58%, #1e40af 100%)'
                            : 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                          color: isSender ? '#f8fbff' : '#0f172a',
                          border: isSender ? '1px solid #1d4ed8' : '1px solid #dce6f2',
                          boxShadow: isSender
                            ? '0 10px 22px rgba(29, 78, 216, 0.28)'
                            : '0 10px 20px rgba(15, 23, 42, 0.06)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: isSender
                              ? '0 12px 24px rgba(29, 78, 216, 0.33)'
                              : '0 12px 24px rgba(15, 23, 42, 0.09)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: 13.1, fontWeight: 800, mb: 0.5, letterSpacing: 0.1 }}>
                          {message.subject}
                        </Typography>
                        <Typography sx={{ fontSize: 11.2, opacity: isSender ? 0.94 : 0.8, mb: 0.1 }}>
                          <Box component="span" sx={{ fontWeight: 700, mr: 0.4 }}>
                            From:
                          </Box>
                          {message.from}
                        </Typography>
                        <Typography sx={{ fontSize: 11.2, opacity: isSender ? 0.94 : 0.8, mb: 0.58 }}>
                          <Box component="span" sx={{ fontWeight: 700, mr: 0.4 }}>
                            To:
                          </Box>
                          {message.to}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13.6,
                            lineHeight: 1.62,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            color: isSender ? '#f8fbff' : '#111827',
                          }}
                        >
                          {message.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              );
            })}

          {isLoadingMore ? (
            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center" sx={{ py: 0.35 }}>
              <CircularProgress size={16} />
              <Typography sx={{ color: mutedText, fontSize: 12 }}>Loading more...</Typography>
            </Stack>
          ) : null}

          <Box ref={loadMoreAnchorRef} sx={{ height: 1, width: '100%' }} />
        </Stack>
      </Box>
    </Box>
  );
};

export default ContactEmailConversation;
