import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';

import PageContainer from '@/components/layout/PageContainer';
import { useSearchClientsLazyQuery } from '@/types/gqlTypes';

// ---- CSV helpers ----
const escapeCsvCell = (val: unknown): string => {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const buildCsv = (headers: string[], rows: unknown[][]): string =>
  [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n');

const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ---- Field definitions ----
type ClientNode = NonNullable<
  ReturnType<typeof useSearchClientsLazyQuery>[1]['data']
>['clientSearch']['nodes'][number];

interface FieldDef {
  key: string;
  label: string;
  defaultOn: boolean;
  requiresSsn?: boolean;
  getValue: (client: ClientNode) => string | number | null | undefined;
}

const CLIENT_FIELD_DEFS: FieldDef[] = [
  {
    key: 'firstName',
    label: 'First Name',
    defaultOn: true,
    getValue: (c) => c.firstName,
  },
  {
    key: 'middleName',
    label: 'Middle Name',
    defaultOn: false,
    getValue: (c) => c.middleName,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    defaultOn: true,
    getValue: (c) => c.lastName,
  },
  {
    key: 'nameSuffix',
    label: 'Name Suffix',
    defaultOn: false,
    getValue: (c) => c.nameSuffix,
  },
  {
    key: 'dob',
    label: 'Date of Birth',
    defaultOn: true,
    getValue: (c) => c.dob,
  },
  {
    key: 'age',
    label: 'Age',
    defaultOn: false,
    getValue: (c) => c.age,
  },
  {
    key: 'gender',
    label: 'Gender',
    defaultOn: true,
    getValue: (c) => c.gender?.join('; '),
  },
  {
    key: 'pronouns',
    label: 'Pronouns',
    defaultOn: false,
    getValue: (c) => c.pronouns?.join('; '),
  },
  {
    key: 'ssn',
    label: 'SSN',
    defaultOn: false,
    requiresSsn: true,
    getValue: (c) => c.ssn,
  },
  {
    key: 'dateCreated',
    label: 'Date Added to System',
    defaultOn: true,
    getValue: (c) => c.dateCreated,
  },
  {
    key: 'dateUpdated',
    label: 'Last Updated',
    defaultOn: false,
    getValue: (c) => c.dateUpdated,
  },
];

type ExportStatus = 'idle' | 'success' | 'error';

const ExportPage: React.FC = () => {
  const [entityType, setEntityType] = useState<'clients'>('clients');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    () =>
      new Set(CLIENT_FIELD_DEFS.filter((f) => f.defaultOn).map((f) => f.key)),
  );
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');

  const [searchClients, { loading }] = useSearchClientsLazyQuery();

  const toggleField = (key: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleExport = useCallback(async () => {
    setExportStatus('idle');
    const activeDefs = CLIENT_FIELD_DEFS.filter((f) =>
      selectedFields.has(f.key),
    );
    const includeSsn = activeDefs.some((f) => f.requiresSsn);

    try {
      const { data } = await searchClients({
        variables: {
          input: {},
          limit: 1000,
          offset: 0,
          includeSsn,
        },
      });

      const clients = data?.clientSearch?.nodes ?? [];
      const headers = activeDefs.map((f) => f.label);
      const rows = clients.map((client) =>
        activeDefs.map((f) => f.getValue(client) ?? ''),
      );

      const csv = buildCsv(headers, rows);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadCsv(`clients-export-${dateStr}.csv`, csv);
      setExportStatus('success');
    } catch {
      setExportStatus('error');
    }
  }, [searchClients, selectedFields]);

  return (
    <PageContainer title='Export Data'>
      <Stack spacing={4}>
        <Typography variant='body2' color='text.secondary'>
          Select a data type, choose which fields to include, and download a CSV
          export.
        </Typography>

        <Paper variant='outlined' sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Entity type selector */}
            <Box>
              <Typography variant='subtitle2' gutterBottom>
                Data Type
              </Typography>
              <ToggleButtonGroup
                value={entityType}
                exclusive
                onChange={(_, v) => v && setEntityType(v)}
                size='small'
              >
                <ToggleButton value='clients'>Clients</ToggleButton>
                <ToggleButton value='enrollments' disabled>
                  Enrollments (coming soon)
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider />

            {/* Field selection */}
            <Box>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={1}
              >
                <Typography variant='subtitle2'>Fields to Include</Typography>
                <Box display='flex' gap={1}>
                  <Button
                    size='small'
                    variant='text'
                    onClick={() =>
                      setSelectedFields(
                        new Set(CLIENT_FIELD_DEFS.map((f) => f.key)),
                      )
                    }
                  >
                    Select All
                  </Button>
                  <Button
                    size='small'
                    variant='text'
                    onClick={() => setSelectedFields(new Set())}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              <FormGroup>
                <Grid container>
                  {CLIENT_FIELD_DEFS.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedFields.has(field.key)}
                            onChange={() => toggleField(field.key)}
                            size='small'
                          />
                        }
                        label={
                          <Typography variant='body2'>{field.label}</Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Box>

            <Divider />

            {/* Export action */}
            <Box display='flex' alignItems='center' gap={2} flexWrap='wrap'>
              <Button
                variant='contained'
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color='inherit' />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={handleExport}
                disabled={loading || selectedFields.size === 0}
              >
                {loading ? 'Fetching data…' : 'Export CSV'}
              </Button>
              <Typography variant='body2' color='text.secondary'>
                Exports up to 1,000 records
              </Typography>
            </Box>

            {exportStatus === 'success' && (
              <Alert
                severity='success'
                onClose={() => setExportStatus('idle')}
              >
                Export downloaded successfully.
              </Alert>
            )}
            {exportStatus === 'error' && (
              <Alert severity='error' onClose={() => setExportStatus('idle')}>
                Export failed. Check your connection and try again.
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </PageContainer>
  );
};

export default ExportPage;
