# File upload fixtures

These files contain plain text even when their extensions represent another
format. They are intended to exercise `FileUpload` selection, validation,
queueing, retry, and removal behavior without requiring real documents.

- `accepted.docx`, `accepted.pdf`, `accepted.png`, and `accepted.xlsx` exercise
  the accepted extensions in the Forms documentation.
- `retry-error.pdf` fails once in the documentation mock and succeeds when
  retried.
- `unsupported.txt` exercises file-type validation.
- `document-1.pdf` through `document-5.pdf` exercise multiple selection and the
  four-file limit.
- Select any file twice to exercise same-file reselection.

To exercise the per-file size limit without keeping a large fixture in the
repository, temporarily set `maxFileBytes` below the size of one of these files.
