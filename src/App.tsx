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
import { toast } from 'bulma-toast';
import './style.scss';
import { ffsOptions } from '@textile/powergate-client';

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
    .then(function(response) {
      return response;
    })
    .catch(function(error) {
      return error;
    });
};

export const isURL = (str: string) => {
  var urlRegex =
    '^(?!mailto:)(?:(?:http|https|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
};

const notify = (msg: string, style = 'is-warning') =>
  toast({
    message: msg,
    type: style as any,
    dismissible: true,
    animate: { in: 'fadeIn', out: 'fadeOut' },
  });

const EthCrypto = require('eth-crypto');

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
                  <div className="navigation is-uppercase has-text-left">
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
                  <div className="signature">
                    <img
                      className="padlock-logo-small"
                      src="https://i.imgur.com/E4Mu7rR.png"
                      alt="padlock logo"
                    />
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
            src="https://i.imgur.com/ii8omEP.png"
            alt="secret network logo"
          />
          <p>Your auto-generated Secret Network address:</p>
          <div className="columns is-fullheight is-centered">
            <div className="column is-half">
              <div className="field">
                <div
                  className={`control has-icons-right  ${!secretPair &&
                    'is-loading'}`}
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
  const [file, setFile] = useState<File | null>();
  const [reviewIsInvoked, setReviewIsInvoked] = useState(false);

  const titleIsInvalid = () => title.length === 0 && reviewIsInvoked;
  const priceIsInvalid = () => price <= 0 && reviewIsInvoked;
  const descriptionIsInvalid = () =>
    (description.length === 0 || description.length > 250) && reviewIsInvoked;
  const categoriesAreInvalid = () =>
    (categories.length === 0 ||
      categories.length > 5 ||
      categories.filter(
        (c) => categories.indexOf(c) !== categories.lastIndexOf(c)
      ).length !== 0) &&
    reviewIsInvoked;
  const fileIsInvalid = () => !file && reviewIsInvoked;

  const review = () => {
    setReviewIsInvoked(true);
  };

  const updateTitle = (newTitle: string) => {
    setReviewIsInvoked(false);
    setTitle(newTitle);
  };

  const updatePrice = (newPrice: number) => {
    setReviewIsInvoked(false);
    setPrice(newPrice);
  };

  const updateDescription = (newDescription: string) => {
    setReviewIsInvoked(false);
    setDescription(newDescription);
  };

  const updateCategories = (newCategories: string[]) => {
    setReviewIsInvoked(false);
    setCategories(newCategories);
  };

  const updateFile = (newFile: File | null | undefined) => {
    setReviewIsInvoked(false);
    setFile(newFile);
  };

  useEffect(() => {
    if (
      !titleIsInvalid() &&
      !priceIsInvalid() &&
      !descriptionIsInvalid() &&
      !categoriesAreInvalid() &&
      !fileIsInvalid() &&
      reviewIsInvoked
    ) {
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
    }
  });

  return (
    <div>
      <section className="section">
        <h1 className="title" style={{ marginTop: '20px' }}>
          Encrypt your Content
        </h1>
        <h1 className="subtitle" style={{ marginBottom: '75px' }}>
          Fill in the information that best describes your content piece
        </h1>
        <div className="columns is-fullheight is-centered">
          <div className="column">
            <div className="columns is-centered">
              <div className="column is-two-thirds-widescreen is-three-fifths-desktop">
                <div className="field">
                  <label className="label">Title</label>
                  <div className="control has-icons-right">
                    <input
                      className={`input ${titleIsInvalid() ? 'is-danger' : ''}`}
                      type="text"
                      placeholder="Title of your creation"
                      value={title}
                      onChange={(e) => updateTitle(e.target.value)}
                    />
                    {titleIsInvalid() && (
                      <span className="icon is-small is-right">
                        <i className="fas fa-exclamation-triangle"></i>
                      </span>
                    )}
                  </div>
                  {titleIsInvalid() && (
                    <p className="help is-danger">Title is invalid</p>
                  )}
                </div>
              </div>
              <div className="column">
                <label className="label">Price</label>
                <div className="field has-addons">
                  <div className="control has-icons-right is-expanded">
                    <input
                      className={`input ${priceIsInvalid() ? 'is-danger' : ''}`}
                      type="number"
                      min="0"
                      placeholder="Set price"
                      value={price}
                      onChange={(e) => updatePrice(Number(e.target.value))}
                    />
                    {priceIsInvalid() && (
                      <span className="icon is-small is-right">
                        <i className="fas fa-exclamation-triangle"></i>
                      </span>
                    )}
                  </div>
                  <div className="control">
                    <p className="button is-static">
                      <strong>DAI</strong>
                    </p>
                  </div>
                </div>
                {priceIsInvalid() && (
                  <p className="help is-danger" style={{ marginTop: '-8px' }}>
                    Price is invalid
                  </p>
                )}
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className={`textarea has-fixed-size ${
                    descriptionIsInvalid() ? 'is-danger' : ''
                  }`}
                  placeholder="Describe what your piece is (max 250 characters)"
                  value={description}
                  onChange={(e) => updateDescription(e.target.value)}
                ></textarea>
              </div>
              {descriptionIsInvalid() && (
                <p className="help is-danger">Description is invalid</p>
              )}
            </div>
            <div className="field">
              <label className="label">Categories</label>
              <div className={`control has-icons-right`}>
                <input
                  className={`input ${
                    categoriesAreInvalid() ? 'is-danger' : ''
                  }`}
                  type="text"
                  placeholder="Categories (max 5) (enter your own, separated by commas)"
                  value={categories.join(',')}
                  onChange={(e) =>
                    updateCategories(e.target.value.split(/\s*,\s*/))
                  }
                />
                {categoriesAreInvalid() && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {categoriesAreInvalid() && (
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
            <div className="field" style={{ marginTop: '32px' }}>
              <div
                className={`file is-medium is-boxed is-centered has-name ${
                  fileIsInvalid() ? 'is-danger' : ''
                }`}
              >
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    onChange={(e) => updateFile(e.target.files?.item(0))}
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
              {fileIsInvalid() && (
                <p className="help is-danger" style={{ textAlign: 'center' }}>
                  No file selected
                </p>
              )}
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
  const secretPair = useSelector((state: State) => state.secretPair);
  const creatorPublicKey = secretPair?.publicKey;
  const [isWorking, setIsWorking] = useState(false);

  const {
    file,
    price,
    metadata,
  }: {
    file: File;
    price: number;
    metadata: {
      title: string;
      description: string;
      categories: string[];
      nsfw: boolean;
    };
  } = props.location;

  const reset = () => {
    history.goBack();
  };

  /**
   * @method encryptWithPublicKey
   * @param {String} pubKey - Compressed 33byte public key starting with 0x03 or 0x02
   * @param {Object} message - message object to encrypt
   */
  async function encryptWithPublicKey(pubKey, message) {
    pubKey = pubKey.substring(2);
    const encryptedObject = await EthCrypto.encryptWithPublicKey(
      pubKey,
      JSON.stringify(message)
    );
    return EthCrypto.cipher.stringify(encryptedObject);
  }

  const publish = async () => {
    try {
      setIsWorking(true);
      const rawText = await file?.text();
      const data = await encryptWithPublicKey(creatorPublicKey, rawText);
      notify('Encrypted the content using Secret Network!');

      const { hash } = (
        await ipfs.files.add(Buffer.from(JSON.stringify(metadata)))
      )[0];
      const pin = await pinByHash(hash);
      console.log(
        `metadata hash: ${hash}\nmetadata pin: ${JSON.stringify(pin)}`
      );
      notify('Pushed content metadata to IPFS!');

      const buffer = Buffer.from(data);
      const { cid } = (await ffs?.addToHot(buffer)) as any;
      await ffs?.pushConfig(cid, ffsOptions.withOverrideConfig(true));
      notify('Hosted encrypted content on Powergate!');
      ffs?.watchLogs((logEvent) => {
        console.log(`received event for cid ${logEvent.cid}`);
        console.log(logEvent);
      }, cid);
      const from = (eth?.web3.currentProvider as any).selectedAddress;
      await eth?.contract.methods
        .create(cid, hash, Eth.toEthUnits(price))
        .send({ from });
      notify('Listed encrypted content on Ethereum!');
      history.push('');
    } catch (error) {
      notify('Error publishing content!', 'is-danger');
      setIsWorking(false);
    }
  };

  return (
    <div>
      {isWorking ? (
        <section className="section">
          <div
            className="content is-medium"
            style={{ textAlign: 'center', marginTop: '180px' }}
          >
            <p>Your content is being padlocked now!</p>
            <img
              className="padlock-logo"
              src="https://i.imgur.com/E4Mu7rR.png"
              alt="padlock logo"
            />
            <p>Protected by the</p>
            <img
              className="secret-network-logo"
              src="https://i.imgur.com/ii8omEP.png"
              alt="secret network logo"
            />
          </div>
        </section>
      ) : (
        <section className="section">
          <h1 className="title" style={{ marginTop: '20px' }}>
            Review
          </h1>
          <h1 className="subtitle" style={{ marginBottom: '75px' }}>
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
                      <span key={c} className="tag is-primary">
                        {c}
                      </span>
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
              <div className="field" style={{ marginTop: '32px' }}>
                <div className="file is-medium is-boxed is-centered has-name">
                  <label className="file-label">
                    <input className="file-input" type="file" disabled />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Content File</span>
                    </span>
                    <span className="file-name">
                      {file?.name && file?.name}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons is-centered" style={{ marginTop: '82px' }}>
            <button
              className="button is-medium is-danger is-rounded"
              onClick={reset}
              disabled={isWorking}
            >
              Reset Fields
            </button>
            <button
              className={`button is-medium is-primary is-rounded ${isWorking &&
                'is-loading'}`}
              onClick={publish}
              disabled={isWorking}
            >
              Padlock It!
            </button>
          </div>
        </section>
      )}
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
  const [saveIsInvoked, setSaveIsInvoked] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const nameIsInvalid = () =>
    (name.length === 0 || !name.match(/^[0-9a-z]+$/)) && saveIsInvoked;
  const websiteIsInvalid = () =>
    website.length !== 0 && !isURL(website) && saveIsInvoked;
  const aboutIsInvalid = () =>
    (about.length === 0 || about.length > 250) && saveIsInvoked;
  const fileIsInvalid = () => false;

  const updateName = (newName: string) => {
    setSaveIsInvoked(false);
    setName(newName);
  };
  const updateWebsite = (newWebsite: string) => {
    setSaveIsInvoked(false);
    setWebsite(newWebsite);
  };
  const updateAbout = (newAbout: string) => {
    setSaveIsInvoked(false);
    setAbout(newAbout);
  };

  const updateFile = (newFile: File | null | undefined) => {
    setSaveIsInvoked(false);
    setFile(newFile);
  };

  const save = () => {
    setSaveIsInvoked(true);
  };

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

  const updateAccount = async () => {
    // TODO: check name is not taken
    try {
      setIsWorking(true);
      await space?.public.set('name', name);
      await space?.public.set('website', website);
      await space?.public.set('about', about);
      if (file) {
        const { hash } = (
          await ipfs.files.add(Buffer.from((await file?.arrayBuffer()) as any))
        )[0];
        await space?.public.set('profile-img-hash', hash);
        const pin = await pinByHash(hash);
        console.log(pin);
      }
      notify('Profile updated!');
      setSaveIsInvoked(false);
      setIsWorking(false);
    } catch (error) {
      notify('Error updating profile!', 'is-danger');
      setSaveIsInvoked(false);
      setIsWorking(false);
    }
  };

  useEffect(() => {
    if (
      !nameIsInvalid() &&
      !websiteIsInvalid() &&
      !aboutIsInvalid() &&
      !fileIsInvalid() &&
      saveIsInvoked &&
      !isWorking
    ) {
      updateAccount();
    }
  });

  return (
    <div>
      <section className="section">
        <h1
          className="title"
          style={{ marginBottom: '104px', marginTop: '20px' }}
        >
          Your Profile
        </h1>
        <div className="columns is-fullheight is-centered">
          <div className="column">
            <div className="field">
              <label className="label">Name</label>
              <div
                className={`control ${loading && 'is-loading'} has-icons-right`}
              >
                <input
                  className={`input ${nameIsInvalid() ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Your account name"
                  value={name}
                  onChange={(e) => updateName(e.target.value)}
                />
                {nameIsInvalid() && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {nameIsInvalid() && (
                <p className="help is-danger">This name is invalid</p>
              )}
            </div>
            <div className="field">
              <label className="label">Website (optional)</label>
              <div
                className={`control ${loading && 'is-loading'} has-icons-right`}
              >
                <input
                  className={`input ${websiteIsInvalid() ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Your website"
                  value={website}
                  onChange={(e) => updateWebsite(e.target.value)}
                />
                {websiteIsInvalid() && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {websiteIsInvalid() && (
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
                    aboutIsInvalid() ? 'is-danger' : ''
                  }`}
                  placeholder="Say something about yourself"
                  value={about}
                  onChange={(e) => updateAbout(e.target.value)}
                />
                {aboutIsInvalid() && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {aboutIsInvalid() && (
                <p className="help is-danger">About text is invalid</p>
              )}
            </div>
          </div>
          <div className="column">
            <div className="field" style={{ marginTop: '32px' }}>
              <div
                className={`file is-medium is-boxed is-centered has-name ${
                  fileIsInvalid() ? 'is-danger' : ''
                }`}
              >
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    onChange={(e) => updateFile(e.target.files?.item(0))}
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
              {fileIsInvalid() && (
                <p className="help is-danger" style={{ textAlign: 'center' }}>
                  No file selected
                </p>
              )}
            </div>
            <div className="buttons is-centered">
              <button
                className={`button is-medium is-primary is-rounded ${isWorking &&
                  'is-loading'}`}
                onClick={save}
                style={{ marginTop: '82px' }}
                disabled={isWorking}
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
  const eth = useSelector((state: State) => state.eth);
  const secretPair = useSelector((state: State) => state.secretPair);
  const ffs = useSelector((state: State) => state.ffs);

  const [creationData, setCreationData] = useState<{
    profile: { name: string } | null;
    metadata: {
      title: string;
      description: string;
      categories: string[];
      nsfw: boolean;
    } | null;
  }>({ profile: null, metadata: null });
  const [searchFilter, setSearchFilter] = useState('');

  const GET_CREATIONS = gql`
    query {
      creations {
        id
        creator
        hash
        metadataHash
        price
        orders {
          buyer
          recipient
        }
      }
    }
  `;

  /*
  todo get private key from secret network if holding NFT, and decrypt
  const privateKey = '0x7934533cd797cfe47d7b5c43ddcf80ee1605aa2d209137bbf1c8b5bb4003f194';

      const decrypted = await decryptWithPrivateKey(privateKey, encryptedString)
  */
  async function decryptWithPrivateKey(privateKey: string, encrypted: string) {
    const encryptedObject = EthCrypto.cipher.parse(encrypted);
    const decryptedString = await EthCrypto.decryptWithPrivateKey(
      privateKey,
      encryptedObject
    );
    console.log(`decrypted=${decryptedString}`);
  }

  const getProfile = async (address: string) => {
    const profile = await Box.getSpace(address, 'Padlock');
    return profile;
  };

  const { data } = useQuery(GET_CREATIONS, {
    pollInterval: 10000,
  });

  useEffect(() => {
    data?.creations.map(async (creation: any) => {
      let metadata: {
        title: string;
        description: string;
        categories: string[];
        nsfw: boolean;
      };
      try {
        const { data } = await axios.get(
          `https://gateway.pinata.cloud/ipfs/${creation.metadataHash}`
        );
        metadata = data;
      } catch (e) {}
      const profile: { name: string } = await getProfile(creation.creator);
      setCreationData((state: any) => ({
        ...state,
        [creation.id]: { profile, metadata },
      }));
    });
  }, [data]);

  const purchase = async (creation: any) => {
    try {
      const contentId = creation.id;
      const amount = creation.price;
      const value = Eth.toEthUnits(amount);
      const from = (eth?.web3.currentProvider as any).selectedAddress;
      const padlockContractAddress = eth?.contract.options.address;
      const recipient = secretPair?.address;

      if (!recipient || !contentId) {
        notify('Error buying content!', 'is-danger');
        return
      }
      await eth?.paymentContract.methods
        .approve(padlockContractAddress, Eth.toEthUnits(amount))
        .send({ from });
      notify(`Thanks for your payment, please sign the order transaction to finalize.`);
      await eth?.contract.methods
        .order(parseInt(contentId), recipient)
        .send({ from });
      notify(`Thanks for your purchase, your content is being unlocked.`);
    } catch (error) {
      notify('Error buying content!', 'is-danger');
    }
  };

  const download = async (contentId: string, contentHash: string) => {
    debugger
    const blob = await ffs?.get(contentHash);
    // TODO: convert to file, decrypt, and download
  };

  const hasPurchased = (creation: any) => {
    const user = (eth?.web3.currentProvider as any).selectedAddress;
    const owned = creation.orders.some(
      (order) =>
        order.buyer.toLowerCase() === //this is already lower but to be sure
        user.toLowerCase()
    )
    return owned;
  }

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
                (creationData[e.id]?.metadata?.title as string)
                  ?.toLowerCase()
                  .includes(searchFilter.toLowerCase()) ||
                (creationData[e.id]?.metadata?.description as string)
                  ?.toLowerCase()
                  .includes(searchFilter.toLowerCase()) ||
                (creationData[e.id]?.metadata
                  ?.categories as string[])?.includes(
                  searchFilter.toLowerCase()
                ) ||
                (creationData[e.id]?.profile?.name as string)
                  ?.toLowerCase()
                  .includes(searchFilter.toLowerCase())
            )
            .map((e: any) => {
              return (
                <div key={e.id} className="card">
                  <div className="card-image">
                    <figure className="image is-16by9">
                      <img
                        src="https://i.imgur.com/CG13BET.png"
                        alt="Placeholder"
                      />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <div className="media-content">
                        <div>
                          <label className="checkbox subtitle is-6">
                            <input
                              type="checkbox"
                              disabled
                              checked={creationData[e.id]?.metadata?.nsfw}
                            />
                            &nbsp;
                            <span>NSFW</span>
                          </label>
                        </div>
                        <div>
                          <label className="subtitle is-6">
                            <span>Sales: {e.orders.length}</span>
                          </label>
                        </div>
                        <div className="tags">
                          {creationData[e.id]?.metadata?.categories.map(
                            (c: any) => (
                              <span key={c} className="tag is-primary">
                                {c}
                              </span>
                            )
                          )}
                        </div>
                        <p className="subtitle is-6">
                          {creationData[e.id]?.profile?.name}
                        </p>
                      </div>
                      <div className="title is-5">
                        {creationData[e.id]?.metadata?.title}
                      </div>
                      <div className="content">
                        {creationData[e.id]?.metadata?.description}
                      </div>

                      <span className="tag is-medium is-warning subtitle">
                        {e.price} DAI
                      </span>
                      {hasPurchased(e) ? (
                        <button
                          onClick={() => download(e.id, e.hash)}
                          className="button is-fullwidth is-primary is-rounded"
                        >
                          Download
                        </button>
                      ) : (
                        <button
                          onClick={() => purchase(e)}
                          className="button is-fullwidth is-primary is-rounded"
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

export default App;
