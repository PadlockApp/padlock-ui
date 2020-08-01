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
//@ts-ignore
import IPFS from 'ipfs-api';
import axios from 'axios';
import './style.scss';

// import { ThreadID } from '@textile/hub';
// import { FileDocument } from './schemas';
const { REACT_APP_PINATA_KEY, REACT_APP_PINATA_SECRET } = process.env;

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const pinByHash = (hashToPin: string) => {
  const url = `https://api.pinata.cloud/pinning/pinByHash`;
  const body = {
    hashToPin: hashToPin,
  };
  return axios
    .post(url, body, {
      headers: {
        pinata_api_key: REACT_APP_PINATA_KEY,
        pinata_secret_api_key: REACT_APP_PINATA_SECRET,
      },
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

function App() {
  const space = useSelector((state: State) => state.space);

  const [navExpanded, setNavExpanded] = useState<boolean>(false);
  const toggleNavExpanded = () => setNavExpanded(!navExpanded);
  const [imgUrl, setImgUrl] = useState('https://i.imgur.com/4b2rBVh.png');

  useEffect(() => {
    (async () => {
      if (space) {
        const profileImgHash = await space.public.get('profile-img-hash');
        if (profileImgHash) {
          setImgUrl(`https://gateway.pinata.cloud/ipfs/${profileImgHash}`);
        }
      }
    })();
  }, [space]);

  return (
    <Router>
      <div id="app">
        <div className="container window">
          <div className="columns is-gapless">
            <div className="column is-4">
              <aside className="menu">
                <ul className="menu-list">
                  <div className="profile media">
                    <div className="media-left">
                      <figure className="image is-128x128">
                        <img className="is-rounded" src={imgUrl} />
                      </figure>
                    </div>
                  </div>
                  <div className="is-uppercase has-text-left">
                    <NavLink
                      to="/account"
                      activeClassName="is-active"
                      className="subtitle is-7"
                    >
                      <i className="fas fa-user"></i> <span>Account</span>
                    </NavLink>
                    <NavLink
                      to="/publish"
                      activeClassName="is-active"
                      className="subtitle is-7"
                    >
                      <i className="fas fa-cloud-upload-alt"></i>{' '}
                      <span>Encrypt + Publish</span>
                    </NavLink>

                    <NavLink
                      to="/browse"
                      activeClassName="is-active"
                      className="subtitle is-7"
                    >
                      <i className="fas fa-search"></i> <span>Browse</span>
                    </NavLink>
                  </div>
                </ul>
              </aside>
            </div>
            <div className="column">
              <Switch>
                <Route path="/account">
                  <Account />
                </Route>
                <Route path="/publish">
                  <Publish />
                </Route>
                <Route path="/browse">
                  <Browse />
                </Route>
                <Route path="/">
                  <Redirect to="/create" />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

function Publish() {
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
              <div className={`control has-icons-right`}>
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

  const [name, setName] = useState('Loading..');
  const [website, setWebsite] = useState('Loading..');
  const [about, setAbout] = useState('Loading..');
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (space) {
        const loadedName = await space.public.get('name');
        const loadedWebsite = await space.public.get('website');
        const loadedAbout = await space.public.get('about');
        setName(loadedName ? loadedName : 'anonymous');
        setWebsite(loadedWebsite ? loadedWebsite : '');
        setAbout(loadedAbout ? loadedAbout : '');
        setLoading(false);
      }
    })();
  }, [space]);
  const nameIsInvalid = false;

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleWebsiteChange = (e: any) => {
    setWebsite(e.target.value);
  };

  const handleAboutChange = (e: any) => {
    setAbout(e.target.value);
  };

  const updateAccount = async () => {
    space?.public.set('name', name);
    space?.public.set('website', website);
    space?.public.set('about', about);
    const { hash } = (
      await ipfs.files.add(Buffer.from((await file?.arrayBuffer()) as any))
    )[0];
    await space?.public.set('profile-img-hash', hash);
    const a = await pinByHash(hash);
    console.log(a);
  };

  return (
    <div>
      <section className="section">
        <h1
          className="title"
          style={{ marginBottom: '100px', marginTop: '20px' }}
        >
          Your Profile
        </h1>
        <div className="columns is-centered">
          <div className="column is-three-fifths">
            <div className="field">
              <label className="label">Name</label>
              <div
                className={`control ${loading && 'is-loading'} has-icons-right`}
              >
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
              <label className="label">Website (optional)</label>
              <div
                className={`control ${loading && 'is-loading'} has-icons-right`}
              >
                <input
                  className={`input ${false ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Your website"
                  value={website}
                  onChange={handleWebsiteChange}
                />
                {false && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {false && (
                <p className="help is-danger">This website is invalid</p>
              )}
            </div>
            <div className="field">
              <label className="label">
                About yourself (max 250 characters)
              </label>
              <div
                className={`control ${loading && 'is-loading'} has-icons-right`}
              >
                <textarea
                  className={`textarea has-fixed-size ${
                    false ? 'is-danger' : ''
                  }`}
                  placeholder="Say something about yourself"
                  value={about}
                  onChange={handleAboutChange}
                />
                {false && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {false && <p className="help is-danger">About text is invalid</p>}
            </div>
          </div>
          <div className="column">
            <div className="field" style={{ marginTop: '32px' }}>
              <div className="file is-medium is-boxed is-centered has-name">
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
                    <span className="file-label">Set profile image</span>
                  </span>
                  <span className="file-name">{file?.name && file?.name}</span>
                </label>
              </div>
            </div>
            <div className="buttons is-centered">
              <button
                className="button is-medium is-warning is-rounded"
                onClick={updateAccount}
                style={{ marginTop: '82px' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Browse() {
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
