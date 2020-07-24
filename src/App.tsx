import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { State } from './reducers/types';
import { ThreadID } from '@textile/hub';
import { FileDocument } from './schemas';

function App() {
  const [navExpanded, setNavExpanded] = useState<boolean>(false);
  const toggleNavExpanded = () => setNavExpanded(!navExpanded);

  return (
    <Router>
      <div>
        <nav
          className="navbar is-danger"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="container">
            <div className="navbar-brand">
              <a className="navbar-item">
                <img
                  src="https://bulma.io/images/bulma-logo-white.png"
                  width="112"
                  height="28"
                />
              </a>

              <a
                role="button"
                className={`navbar-burger burger ${
                  navExpanded ? 'is-active' : ''
                }`}
                aria-label="menu"
                aria-expanded={navExpanded}
                data-target="nav-content"
                onClick={toggleNavExpanded}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            </div>
            <div
              id="nav-content"
              className={`navbar-menu ${navExpanded ? 'is-active' : ''}`}
            >
              <div className="navbar-start">
                <NavLink
                  to="/discover"
                  activeClassName="is-active"
                  className="navbar-item"
                >
                  Discover
                </NavLink>
                <NavLink
                  to="/create"
                  activeClassName="is-active"
                  className="navbar-item"
                >
                  Create
                </NavLink>
                <NavLink
                  to="/account"
                  activeClassName="is-active"
                  className="navbar-item"
                >
                  Account
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
        <Switch>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/discover"></Route>
          <Route path="/">
            <Redirect to="/create" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Create() {
  const ffs = useSelector((state: State) => state.ffs);
  const db = useSelector((state: State) => state.db);
  const thread = useSelector((state: State) => state.thread) as ThreadID;

  const titleIsInvalid = false;

  const [file, setFile] = useState<File | null>();
  const [cloudFiles, setCloudFiles] = useState<FileDocument[]>([]);

  const updateFiles = async () => {
    const files = (await db?.find(thread, 'files', {}))?.instancesList;
    setCloudFiles(files as [FileDocument]);
  };

  useEffect(() => {
    updateFiles();
  }, [db, thread]);

  const publish = async () => {
    const arrayBuf = await file?.arrayBuffer();
    const { cid } = (await ffs?.addToHot(
      Buffer.from(arrayBuf as ArrayBuffer)
    )) as any;
    await ffs?.pushConfig(cid);
    ffs?.watchLogs((logEvent) => {
      console.log(`received event for cid ${logEvent.cid}`);
      console.log(logEvent);
    }, cid);

    await db?.create(thread, 'files', [{ name: file?.name, cid }]);
    await updateFiles();
  };

  const download = async (id: string) => {
    const { instance: fileDoc } = (await db?.findByID(thread, 'files', id)) as {
      instance: FileDocument;
    };
    const byte = await ffs?.get(fileDoc.cid);
    const blob = new Blob([byte as Uint8Array]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileDoc.name;
    link.click();
  };

  return (
    <div>
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="field">
              <label className="label">Title</label>
              <div className="control has-icons-right">
                <input
                  className={`input ${titleIsInvalid ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Title of your creation"
                />
                {titleIsInvalid && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {titleIsInvalid && (
                <p className="help is-danger">This title is invalid</p>
              )}
            </div>

            <div className="field">
              <div className="file has-name is-fullwidth is-warning">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.item(0))}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                  <span className="file-name">{file?.name && file?.name}</span>
                </label>
              </div>
            </div>

            <div className="field has-addons">
              <p className="control">
                <a className="button is-static">DAI</a>
              </p>
              <p className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="How much would you charge for it?"
                />
              </p>
            </div>

            <div className="field">
              <label className="label">Category</label>
              <div className="control">
                <div className="select  is-fullwidth">
                  <select>
                    <option>Music</option>
                    <option>Video</option>
                    <option>Image</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Tell us more about your creation.."
                ></textarea>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" />
                  &nbsp; &nbsp;
                  <span>Creation contains</span>
                  &nbsp;
                  <a href="#">NSFW material</a>
                </label>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link is-success">
                  Encrypt + Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="panel">
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
      </a> */}
    </div>
  );
}

function Account() {
  // const ffs = useSelector((state: State) => state.ffs);
  const nameIsInvalid = false;
  return (
    <div>
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="field">
              <label className="label">Name</label>
              <div className="control has-icons-right">
                <input
                  className={`input ${nameIsInvalid ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Title of your creation"
                  value="anonymous"
                />
                {nameIsInvalid && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {nameIsInvalid && (
                <p className="help is-danger">This name is invalid</p>
              )}
            </div>
            <div className="field">
              <label className="label">Your secret address</label>
              <div className="control has-icons-right">
                <input
                  className={'input'}
                  type="text"
                  disabled={true}
                  value="secret..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
