"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// HTTP.
import http from 'http'

// Source.
import * as auth from '../src/http-auth'

// Digest auth.
describe('digest', () => {
    let server = undefined;

    before(() => {
        // Configure authentication.
        const digest = auth.digest({
            realm: "Simon Area.",
            file: __dirname + "/../data/users.htdigest"
        });

        // Creating new HTTP server.
        server = http.createServer(digest, (req, res) => {
            res.end(`Welcome to private area - ${req.user}!`);
        });

        // Start server.
        server.listen(1337);
    });

    after(() => {
        server.close();
    });

    it('success', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - vivi!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vivi', 'anna', false);
    });

    it('special uri', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - vivi!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337/?coffee=rocks', callback).auth('vivi', 'anna', false);
    });

    it('wrong password', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vivi', 'goose', false);
    });

    it('wrong user', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('brad', 'anna', false);
    });
});
