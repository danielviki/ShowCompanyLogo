import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const footerStyles = {
  bgcolor: 'primary.main',
  borderTop: '1px solid',
  borderColor: 'divider',
  py: 4,
  fontFamily: 'Noto Sans, Noto Sans SC, sans-serif',
};

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={footerStyles}>
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          align="center"
          sx={{
            color: '#fff', // Changed to white
            fontSize: '0.875rem',
            fontWeight: 400
          }}
        >
          {t('footer.copyright', { year: currentYear })}
        </Typography>
      </Container>
    </Box>
  );
}
