import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
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
//@ts-ignore
import * as Box from '3box';
import './style.scss';

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

  const [imgUrl, setImgUrl] = useState('https://i.imgur.com/4b2rBVh.png');
  const [name, setName] = useState('Loading..');

  useEffect(() => {
    (async () => {
      if (space) {
        const profileImgHash = await space.public.get('profile-img-hash');
        if (profileImgHash) {
          setImgUrl(`https://gateway.pinata.cloud/ipfs/${profileImgHash}`);
        }
        const loadedName = await space.public.get('name');
        setName(loadedName ? loadedName : 'anonymous');
      }
    })();
  }, [space]);

  return (
    <Router>
      <div id="app">
        <div className="container window">
          <div className="columns is-fullheight is-gapless">
            <div className="column is-4">
              <aside className="menu">
                <ul className="menu-list">
                  <div className="profile media">
                    <div className="media-left">
                      <figure className="image is-128x128">
                        <img
                          className="is-rounded"
                          src={imgUrl}
                          alt="user profile"
                        />
                      </figure>
                      <div className="profile-name media-content">
                        <p className="title is-5 is-padlock">{name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="is-uppercase has-text-left">
                    <NavLink
                      to="/account"
                      activeClassName="is-active"
                      className="subtitle is-6"
                    >
                      <i className="fas fa-user"></i> <span>Account</span>
                    </NavLink>
                    <NavLink
                      to="/publish"
                      activeClassName="is-active"
                      className="subtitle is-6"
                    >
                      <i className="fas fa-cloud-upload-alt"></i>{' '}
                      <span>Encrypt + Publish</span>
                    </NavLink>

                    <NavLink
                      to="/browse"
                      activeClassName="is-active"
                      className="subtitle is-6"
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
                <Route exact path="/publish">
                  <Publish />
                </Route>
                <Route path="/publish/review" component={Review} />
                <Route path="/browse">
                  <Browse />
                </Route>
                <Route path="/">
                  <Welcome />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

function Welcome() {
  const history = useHistory();
  const secretPair = useSelector((state: State) => state.secretPair);

  return (
    <div>
      <section className="section">
        <div
          className="content is-medium"
          style={{ textAlign: 'center', marginTop: '70px' }}
        >
          <p>Hi there! Welcome to</p>
          <img
            className="padlock-logo"
            src="https://i.imgur.com/E4Mu7rR.png"
            alt="padlock logo"
          />
          <p>Protected by the</p>
          <img
            className="secret-network-logo"
            src="https://i.imgur.com/phjTAMI.png"
            alt="secret network logo"
          />
          <p>Your auto-generated Secret Network address:</p>
          <div className="columns is-fullheight is-centered">
            <div className="column is-half">
              <div className="field">
                <div
                  className={`control has-icons-right  ${
                    !secretPair && 'is-loading'
                  }`}
                >
                  <input
                    className={'input  is-medium'}
                    type="text"
                    disabled={true}
                    value={secretPair?.address || 'Loading..'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="buttons is-centered">
            <button
              className="button is-medium is-primary is-rounded"
              onClick={() => history.push('account')}
              style={{ marginTop: '40px' }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Publish() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [nsfw, setNsfw] = useState(false);

  // TODO: field verification
  const titleIsInvalid = false;
  // const priceIsInvalid = false;
  // const descriptionIsInvalid = false;
  // const categoriesAreInvalid = false;

  const [file, setFile] = useState<File | null>();

  const review = () => {
    const to = {
      pathname: '/publish/review',
      file,
      price,
      metadata: {
        title,
        description,
        categories: categories.filter((e) => e.length !== 0),
        nsfw,
      },
    };
    history.push(to);
  };

  return (
    <div>
      <section className="section">
        <h1 className="title" style={{ marginTop: '20px' }}>
          Encrypt your Content
        </h1>
        <h1 className="subtitle" style={{ marginBottom: '100px' }}>
          Fill in the information that best describes your content piece
        </h1>
        <div className="columns is-fullheight is-centered">
          <div className="column">
            <div className="columns is-centered">
              <div className="column is-three-fifths">
                <div className="field">
                  <label className="label">Title</label>
                  <div className={`control has-icons-right`}>
                    <input
                      className={`input ${titleIsInvalid ? 'is-danger' : ''}`}
                      type="text"
                      placeholder="Title of your creation"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
              </div>
              <div className="column">
                <label className="label">Price</label>
                <div className="field has-addons">
                  <p className="control is-expanded">
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="Set price"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </p>
                  <p className="control">
                    <p className="button is-static">
                      <strong>DAI</strong>
                    </p>
                  </p>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea has-fixed-size"
                  placeholder="Describe what your piece is (max 250 characters)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Categories</label>
              <div className={`control has-icons-right`}>
                <input
                  className={`input ${false ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Categories (enter your own, separated by commas)"
                  value={categories.join(',')}
                  onChange={(e) =>
                    setCategories(e.target.value.split(/\s*,\s*/))
                  }
                />
                {false && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {false && (
                <p className="help is-danger">
                  The entered categories are invalid
                </p>
              )}
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={nsfw}
                    onChange={() => setNsfw(!nsfw)}
                  />
                  &nbsp; &nbsp;
                  <span>Contains NSFW material</span>
                </label>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
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
                    <span className="file-label">Content File</span>
                  </span>
                  <span className="file-name">{file?.name && file?.name}</span>
                </label>
              </div>
            </div>
            <div className="buttons is-centered">
              <button
                className="button is-medium is-primary is-rounded"
                onClick={review}
                style={{ marginTop: '82px' }}
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Review(props: any) {
  const history = useHistory();
  const ffs = useSelector((state: State) => state.ffs);
  const eth = useSelector((state: State) => state.eth);

  const { file, price, metadata } = props.location;

  const reset = () => {
    history.goBack();
  };

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
      .create(cid, 'hello', Eth.toEthUnits(price))
      .send({ from });
    // TODO: use the following info
    // TODO: add toasts + notify.js
    console.log(file, price, JSON.stringify(metadata));
  };

  return (
    <div>
      <section className="section">
        <h1 className="title" style={{ marginTop: '20px' }}>
          Review
        </h1>
        <h1 className="subtitle" style={{ marginBottom: '100px' }}>
          Review the information for your content piece
        </h1>
        <div className="columns is-fullheight is-centered">
          <div className="column">
            <div className="columns is-centered">
              <div className="column is-three-fifths">
                <div className="field">
                  <label className="label">Title</label>
                  <div className="content">{metadata?.title}</div>
                </div>
              </div>
              <div className="column">
                <label className="label">Price</label>
                <div className="content">{price} DAI</div>
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="content">{metadata?.description}</div>
            </div>
            <div className="field">
              <label className="label">Categories</label>
              <div className={`control has-icons-right`}>
                <div className="tags">
                  {metadata?.categories.map((c: any) => (
                    <span className="tag is-primary">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" disabled checked={metadata?.nsfw} />
                  &nbsp; &nbsp;
                  <span>Contains NSFW material</span>
                </label>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <div className="file is-medium is-boxed is-centered has-name">
                <label className="file-label">
                  <input className="file-input" type="file" disabled />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">Content File</span>
                  </span>
                  <span className="file-name">{file?.name && file?.name}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons is-centered" style={{ marginTop: '82px' }}>
          <button
            className="button is-medium is-danger is-rounded"
            onClick={reset}
          >
            Reset Fields
          </button>
          <button
            className="button is-medium is-primary is-rounded"
            onClick={publish}
          >
            Padlock It!
          </button>
        </div>
      </section>
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

  // TODO: add field verification

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
    if (file) {
      const { hash } = (
        await ipfs.files.add(Buffer.from((await file?.arrayBuffer()) as any))
      )[0];
      await space?.public.set('profile-img-hash', hash);
      const pin = await pinByHash(hash);
      console.log(pin);
    }
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
        <div className="columns is-fullheight is-centered">
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
                    <span className="file-label">Profile Image</span>
                  </span>
                  <span className="file-name">{file?.name && file?.name}</span>
                </label>
              </div>
            </div>
            <div className="buttons is-centered">
              <button
                className="button is-medium is-primary is-rounded"
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
  const [creators, setCreators] = useState<any>({});
  const [searchFilter, setSearchFilter] = useState('');

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

  const getProfile = async (address: string) => {
    const profile = await Box.getSpace(address, 'Padlock');
    return profile;
  };

  const { data } = useQuery(GET_CREATIONS, {
    pollInterval: 500,
  });

  useEffect(() => {
    data?.creations.map((creator: any) => {
      setCreators((state: any) => ({
        ...state,
        [creator.id]: { name: 'Loading..' },
      }));
      getProfile(creator.creator).then((c: any) => {
        setCreators((state: any) => ({ ...state, [creator.id]: c }));
      });
    });
  }, [data]);

  return (
    <div>
      <section className="section">
        <div className="field is-grouped">
          <p className="control">
            <input
              className="input is-medium is-rounded"
              type="text"
              placeholder="Browse"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </p>
        </div>
        <div className="card-container">
          {data?.creations
            .filter(
              (e: any) =>
                (e.description as string)
                  .toLowerCase()
                  .includes(searchFilter) ||
                (creators[e.id]?.name as string)
                  ?.toLowerCase()
                  .includes(searchFilter)
            )
            .map((e: any) => (
              <div key={e.id} className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src="https://bulma.io/images/placeholders/1280x960.png"
                      alt="Placeholder"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content">
                    <div>creator: {creators[e.id]?.name}</div>
                    {/* <div>CID hash: {e.hash}</div> */}
                    <div>{e.description}</div>
                    <span className="tag is-warning">{e.price} DAI</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default App;
