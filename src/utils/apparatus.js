import io from 'socket.io-client';

var APP_URL = 'apparatusapp.com',
  API_URL = 'https' + '://' + 'api' + '.' + APP_URL,
  SOCKET_URL = 'https' + '://' + 'sockets' + '.' + APP_URL;

function Apparatus(options, dev) {
  constructor;
  if (typeof options === 'object') {
    /**
     *  Apparatus integration token
     *
     */

    if (!options.token) throw 'Error: Token not provided.';

    /**
     *  Debug mode switch
     *
     */

    DEBUG = options.debug;
  } else {
    throw 'Error: Options argument must be an object.';
  }

  this.token = options.token;

  this.emailUrl = options.email_url;

  this.socket_query = {
    jwt: this.token,
    type: 'login'
  };

  this._events = {
    user_logged_in: '',
    update_qr_code: 'updateQRCode',
    confirmed_login: 'confirmed_login',
    login: 'confirmedScan',
    error: 'apparatusError'
  };

  if (dev) {
    API_URL = dev.url;
    SOCKET_URL = dev.socket;
  }

  logger('object constructed');
}

Apparatus.prototype.connect = function() {
  this.socket = io.connect(SOCKET_URL, {
    query: this.socket_query,
    reconnection: true,
    reconnectionAttempts: 3
  });

  return new Promise(
    function(res, rej) {
      this.socket.once('connect', function(data) {
        logger('connected to socket as integration');
        res(data);
      });

      this.socket.once('apparatusError', function(error) {
        console.log(error);
        logger('an error has occured while connecting to socket server');
        rej(new Error(error));
      });

      this.socket.on('reconnect_failed', function(error) {
        // Thows error after all failed attemps (reconnectionAttempts)
        console.log(error);
        logger('failed to reconnect to socket server');
        rej(new Error(error));
      });
    }.bind(this)
  );
};

Apparatus.MAGIC_LINK = 'magic_link';

Apparatus.prototype.disconnect = function() {
  logger('object disconnected from server');

  return new Promise(
    function(res, rej) {
      this.socket.once('disconnect', function(response) {
        res(response);
      });

      this.socket.disconnect();
    }.bind(this)
  );
};

Apparatus.prototype._api = function(url) {
  return API_URL + url;
};

Apparatus.prototype._contactByEmail = function(email) {
  return fetch(this._api('/integration/contact/by-email'), {
    headers: {
      Authorization: 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({
      email,
      email_url: this.emailUrl
    })
  })
    .then(response => {
      if (response.ok) return response.json();
      else throw response;
    })
    .catch(error => {
      return error.json().then(json => {
        throw json;
      });
    });
};

Apparatus.prototype.contact = function(data) {
  if (!data.contact_type) throw 'Error: Contact type is required.';

  switch (data.contact_type) {
    case 'magic':
      if (!data.identification) throw 'Error: Email not provided.';

      return this._contactByEmail(data.identification);
    default:
      throw 'Error: Unsupported contact type.';
  }
};

Apparatus.prototype.on = function(event, handlerFunc) {
  logger(event + ' listener initialized');

  if (!this._events.hasOwnProperty(event)) throw 'Invalid Event ' + event;

  this.socket.on(this._events[event], handlerFunc);
};

Apparatus.prototype.login = function(token) {
  return fetch(this._api('/integration/direct'), {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: token,
      mode: 'magic_link'
    })
  })
    .then(response => {
      if (response.ok) return response.json();
      else throw response;
    })
    .catch(error => {
      return error.json().then(json => {
        throw json;
      });
    });
};

Apparatus.prototype.register = function(data) {
  return fetch(this._api('/integration/register'), {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: data.email
    })
  })
    .then(response => {
      if (response.ok) return response.json();
      else throw response;
    })
    .catch(error => {
      return error.json().then(json => {
        throw json;
      });
    });
};

export default Apparatus;

/** Helpers **/
var logger,
  DEBUG = true;

if (DEBUG)
  logger = function(msg) {
    console.log('%capparatus:', 'font-weight: bold; font-size: 11px; color: blue;', msg);
  };
else logger = function() {};
