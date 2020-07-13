import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from './reducers/types';
import { ThreadID } from '@textile/hub';
import { FileDocument } from './schemas';

function App() {
  const ffs = useSelector((state: State) => state.ffs);
  const db = useSelector((state: State) => state.db);
  const thread = useSelector((state: State) => state.thread) as ThreadID;

  const [file, setFile] = useState<File | null>();
  const [cloudFiles, setCloudFiles] = useState<FileDocument[]>([]);

  const updateFiles = async () => {
    const files = (await db?.find(thread, 'files', {}))?.instancesList;
    setCloudFiles(files as [FileDocument]);
  }

  useEffect(() => {
    updateFiles();
  }, [db, thread])

  const publish = async () => {
    const arrayBuf = await file?.arrayBuffer();
    const { cid } = await ffs?.addToHot(Buffer.from(arrayBuf as ArrayBuffer)) as any;
    await ffs?.pushConfig(cid);
    console.log()

    await db?.create(thread, 'files', [{ name: file?.name, cid }]);
    await updateFiles();
  }

  const download = async (id: string) => {
    const { instance: fileDoc } = await db?.findByID(thread, 'files', id) as { instance: FileDocument };
    const byte = await ffs?.get(fileDoc.cid);
    const blob = new Blob([byte as Uint8Array]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileDoc.name;
    link.click();
  }

  return (
    <div className="container">
      <div className="panel">
        <p className="panel-heading">
          Cloud Content
          </p>
        <>
          {
            cloudFiles?.map(file =>
              <a className="panel-block" key={file._id} onClick={() => download(file._id)}>
                <span className="panel-icon">
                  <i className="fas fa-file"></i>
                </span>
                {file.name}
              </a>
            )
          }
        </>
      </div>

      <div className="file is-danger has-name is-boxed">
        <label className="file-label">
          <input className="file-input" type="file" name="resume" onChange={e => setFile(e.target.files?.item(0))} />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-file-import"></i>
            </span>
            <span className="file-label">
              Select a file…
            </span>
          </span>
          <span className="file-name">{file?.name && file?.name.slice(0, 18) + '...'}</span>
        </label>
      </div>
      <a className="button is-info is-outlined" onClick={publish}>
        <span className="icon is-small">
          <i className="fas fa-cloud"></i>
        </span>
        <span>Publish</span>
      </a>
    </div>
  );
}

export default App;
