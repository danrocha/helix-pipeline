/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
const assert = require('assert');
const { Logger } = require('@adobe/helix-shared');
const status = require('../src/xml/set-xml-status.js');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test set-xml-status', () => {
  const error = 'oh, no!';

  it('sets a verbose 500 for an error in dev', () => {
    assert.deepEqual(
      status.selectStatus(false)({ content: { }, error }, { logger }),
      {
        response: {
          status: 500,
          body: `<?xml version="1.0" encoding="utf-8"?><error><code>500</code><message>${error}</message></error>`,
          headers: {
            'Content-Type': 'application/xml',
          },
        },
      },
    );
  });

  it('sets a terse 500 for an error in production', () => {
    assert.deepEqual(
      status.selectStatus(true)({ content: { }, error }, { logger }),
      {
        response: {
          status: 500,
          body: '',
        },
      },
    );
  });

  it('keeps an existing status', () => {
    assert.deepEqual(
      status({
        response: {
          status: 201,
        },
      }, { logger }),
      {},
    );
  });

  it('sets a 200 if all good', () => {
    assert.deepEqual(
      status({
        content: {
          xml: {
            root: {},
          },
        },
      },
      { logger }),
      {
        response: {
          status: 200,
        },
      },
    );
  });
});
