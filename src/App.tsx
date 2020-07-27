import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from 'react-router-dom';
import gql from 'graphql-tag';
import { useSelector } from 'react-redux';
import { State } from './reducers/types';
import { Eth } from './helper';
import { useQuery } from '@apollo/client';
// import { ThreadID } from '@textile/hub';
// import { FileDocument } from './schemas';

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
          <Route path="/discover">
            <Discover />
          </Route>
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
  // const db = useSelector((state: State) => state.db);
  // const thread = useSelector((state: State) => state.thread) as ThreadID;
  const eth = useSelector((state: State) => state.eth);

  const titleIsInvalid = false;

  const [file, setFile] = useState<File | null>();
  // const [cloudFiles, setCloudFiles] = useState<FileDocument[]>([]);

  // const updateFiles = async () => {
  //   const files = (await db?.find(thread, 'files', {}))?.instancesList;
  //   setCloudFiles(files as [FileDocument]);
  // };

  // useEffect(() => {
  //   updateFiles();
  // }, [db, thread]);

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
    const from = (eth?.web3.currentProvider as any).selectedAddress;
    await eth?.contract.methods
      .create(cid, 'hello', Eth.toEthUnits(20))
      .send({ from });

    // await db?.create(thread, 'files', [{ name: file?.name, cid }]);
    // await updateFiles();
  };

  // const download = async (id: string) => {
  //   const { instance: fileDoc } = (await db?.findByID(thread, 'files', id)) as {
  //     instance: FileDocument;
  //   };
  //   const byte = await ffs?.get(fileDoc.cid);
  //   const blob = new Blob([byte as Uint8Array]);
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = fileDoc.name;
  //   link.click();
  // };

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
                <button className="button is-link is-success" onClick={publish}>
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
  const space = useSelector((state: State) => state.space);
  const secretPair = useSelector((state: State) => state.secretPair);

  const [name, setName] = useState('Loading..');
  const [secretAddress, setSecretAddress] = useState('Loading..');

  useEffect(() => {
    space?.public
      .get('name')
      .then((res: any) => setName(res ? res : 'anonymous'));
  }, [space]);
  const nameIsInvalid = false;

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const updateAccount = () => {
    space?.public.set('name', name);
  };

  return (
    <div>
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="field">
              <label className="label">Your account name</label>
              <div className="control has-icons-right">
                <input
                  className={`input ${nameIsInvalid ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Your account name"
                  value={name}
                  onChange={handleNameChange}
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
                  value={secretPair?.address || 'Loading..'}
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button
                  className="button is-link is-success"
                  onClick={updateAccount}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Discover() {
  // const apolloClient = useSelector((state: State) => state.apolloClient);
  // const [creations, setCreations] = useState<any[]>([]);

  const GET_CREATIONS = gql`
    query {
      creations {
        id
        creator
        hash
        description
        price
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_CREATIONS, {
    pollInterval: 500,
  });

  // useEffect(() => {
  //   apolloClient
  //     ?.query({
  //       query: gql`
  //         query {
  //           creations {
  //             id
  //             creator
  //             hash
  //             description
  //             price
  //           }
  //         }
  //       `,
  //     })
  //     .then((result) => setCreations(result.data.creations));
  // }, [apolloClient]);

  return (
    <div>
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            {data?.creations.map((e: any) => (
              <div key={e.id} className="card">
                <div className="card-content">
                  <div>creator: {e.creator}</div>
                  <div>CID hash: {e.hash}</div>
                  <div>description: {e.description}</div>
                  <div>price: {e.price} DAI</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
