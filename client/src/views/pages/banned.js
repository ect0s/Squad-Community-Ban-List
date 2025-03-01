import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import StepWizard from 'react-step-wizard';

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Jumbotron,
  Row
} from 'reactstrap';

import Layout from '../layout/layout.js';

import { gql, useQuery } from '@apollo/client';

import classnames from 'classnames';

import { DISCORD_INVITE } from 'scbl-lib/config.js';

const GET_PLAYER = gql`
  query Search($id: String!) {
    steamUser(id: $id) {
      id
      name
      bans(orderBy: "created", orderDirection: DESC) {
        edges {
          cursor
          node {
            id
            banList {
              id
              organisation {
                id
                name
                discord
              }
            }
          }
        }
      }
      activeBans: bans(orderBy: "created", orderDirection: DESC, expired: false) {
        edges {
          cursor
          node {
            id
            banList {
              id
              organisation {
                id
                name
                discord
              }
            }
          }
        }
      }
      expiredBans: bans(orderBy: "created", orderDirection: DESC, expired: true) {
        edges {
          cursor
          node {
            id
            banList {
              id
              organisation {
                id
                name
                discord
              }
            }
          }
        }
      }
    }
  }
`;

function EnterSteamUser(props) {
  const [steamID, setSteamID] = useState('');
  const history = useHistory();

  return (
    <>
      <Row className="text-center">
        <Col>
          <h3>Who are you?</h3>
          <p>
            Please enter your Steam 64 ID in the form below so we can tailor the following
            information to you. You can find your Steam 64 ID{' '}
            <a href="https://steamidfinder.com/lookup/" target="_blank" rel="noreferrer">
              here
            </a>
            . Once you have entered your Steam 64 ID click "Next".
          </p>
          <FormGroup>
            <InputGroup
              className={classnames({
                'is-invalid': steamID !== '' && !(steamID && steamID.match(/^[0-9]{17}$/))
              })}
            >
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>

              <Input
                type="text"
                placeholder="Steam 64 ID"
                value={steamID}
                onChange={(e) => setSteamID(e.target.value)}
              />
            </InputGroup>
            <FormFeedback>A valid Steam 64 ID is a 17 digit number.</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" disabled>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
        <Col className="text-center">
          <Button onClick={props.nextStep}>Skip</Button>
        </Col>
        <Col className="text-right">
          <Button
            color="primary"
            onClick={() => history.push(`/banned/${steamID}`)}
            disabled={!(steamID && steamID.match(/^[0-9]{17}$/))}
          >
            Next
            <i className="fa fa-arrow-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

function Foreword(props) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">Foreword</h3>
          <p>
            Hello <strong>{props.steamUser?.name || ''}</strong>,
          </p>
          <p>
            If you have been directed to this page then it likely means that you are listed on and
            potentially banned by GameBans.org.
          </p>
          <p>
            GameBans.org is dedicated to helping create a healthy gaming communities
            that everyone can enjoy, including players that were previously harmful 
            and have since reformed. Therefore, we are keen to assist players in being able to
            access partner communities without GameBans.org limiting where they can
            and cannot play. However, there are limits in what we can do to assist these players due
            to our strict operating procedures.
          </p>
          <p>
            The information provided on the following pages will give you more information on
            GameBans.org as well as information on how you can go about getting yourself
            unlisted from and unbanned by GameBans.org.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" onClick={props.previousStep} disabled={props.isValidSteam64ID}>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={props.nextStep}>
            Next
            <i className="fa fa-arrow-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

function WhatIsTheSquadCommunityBanList(props) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">About GameBans.org</h3>
          <h6>Introduction</h6>
          <p>
            GameBans.org is a community-led project that aims to protect our Partners
            communities through collaboration and information sharing. It is{' '}
            <strong>not</strong> affiliated with any supported Game Pubisher or Developer, and
            they have little to no influence in regards to how GameBans.org is
            operated.
          </p>
          <h6>How Does It Work?</h6>
          <p>
            GameBans.org works with a number of "partner organisations", who provide
            us with access to their ban lists. At regular intervals, our fully automated system
            downloads a copy of the bans on their ban lists and stores them in our database. We then
            provide others with access to the data in our database via this website, Discord bots
            and other channels.
          </p>
          <h6>Only Facts!</h6>
          <p>
            GameBans.org only shares facts regarding players based on the bans we
            import from our partner organisations' ban lists and we do not make or share opinions
            based on the bans we import. Therefore, we will always share the bans we import to our
            users regardless of whether we think the ban is or isn't valid and will only ever remove
            players/bans we share when our partner organisations remove them from their ban lists.
            As a result, there is not much we can do to assist players who are listed or who have
            been banned by our system.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" onClick={props.previousStep}>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={props.nextStep}>
            Next
            <i className="fa fa-arrow-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

function GettingUnlistedFromTheSquadCommunityBanList(props) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">Getting unlisted from GameBans.org</h3>
          <p>
            If a player has been listed on GameBans.org's website, it does not necessarily mean that
            they have been banned by GameBans.org. It only means that we have imported a ban against
            them from one of our partner organisations.
          </p>
          <p>
            As previously mentioned, GameBans.org only shares facts regarding
            players based on the bans we import from our partner organisations' ban lists and will
            only ever remove players/bans we share when our partner organisations remove them from
            their ban lists. As it is unlikely that partner organisation will delete the bans from
            your history it is unlikely that you will be unlisted from GameBans.org.
            However, partner organisations may agree to turn some of your active bans to expired bans.
          </p>
          {props.steamUser && props.steamUser.bans.length === 0 && (
            <>
              <h6>Partner organisations to Contact</h6>
              <p>
                Fortunately, you are not listed on GameBans.org and therefore do not
                need to contact any partner organisations.
              </p>
            </>
          )}
          {props.steamUser && props.steamUser.bans.edges.length > 0 && (
            <>
              <h6>Partner organisations to Contact</h6>
              <p>
                To be unlisted from GameBans.org you should contact the following
                partner organisations. You may click their names to get a link to their Discord
                server.
              </p>
              <ul>
                {[
                  ...new Set(props.steamUser.bans.edges.map((ban) => ban.node.banList.organisation))
                ].map((organisation, key) => (
                  <li key={key}>
                    <a href={organisation.discord} target="_blank" rel="noopener noreferrer">
                      {organisation.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" onClick={props.previousStep}>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={props.nextStep}>
            Next
            <i className="fa fa-arrow-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

function GettingUnbannedFromTheSquadCommunityBanList(props) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">Getting unbanned from GameBans.org</h3>
          <p>
            Partner organizations and servers may opt to use a Gamebans.org export ban lists to protect their
            communities. If you have been kicked from a server with a reason relating to the Gamebans.org, 
            then it means that you have probably met the criteria to be listed on
            one of these export ban lists. Below we will explain these criteria and explain how you
            can attempt to get removed from our export ban lists.
          </p>
          <h6>Criteria System</h6>
          <p>
            Our criteria system uses a point based system that each Partnered Organization can configure when
            creating an export ban list. Bans listed on our website will contribute a number of
            points which can be configured to be different depending on whether they were are active
            or expired, their age and who's ban list they belong to. Once the total number of points
            a player has exceeds the configurable threshold, they will be added to the export ban list
            and banned from the server as a result.
          </p>
          <p>
            Consider the following example using our default points. Bob has 2 active bans that
            contribute 3 points each and 4 expired bans that contribute 1 point each. This makes his
            total number of points 10 which exceeds the default threshold of 9 and therefore Bob
            will be added to the export ban list.
          </p>
          <h6>Getting Unbanned from GameBans.org</h6>
          <p>
            There are a number of different ways of getting unbanned from the GameBans.org:
          </p>
          <ul className="font-weight-light">
            <li>
              Appeal the bans listed on our website so that you no longer meet the criteria of our
              export ban lists.
            </li>
            <li>
              Ask the server you wish to play on to make an exception for you. Some servers have the
              ability to do this if they are importing one of our export ban lists via an admin tool known as
              Battlemetrics.
            </li>
            <li>
              Play on another server. Only a small number of partner servers use GameBans.org
              Ban Lists and therefore there should be a wide range of others servers that you can
              play on.
            </li>
          </ul>
          {props.steamUser && props.steamUser.bans.edges.length > 0 && (
            <>
              <h6>Partner organisations to Contact</h6>
              <p>
                To appeal the bans listed on our website you should contact the following partner
                organisations. You may click their names to get a link to their Discord server.
              </p>
              <ul>
                {[
                  ...new Set(props.steamUser.bans.edges.map((ban) => ban.node.banList.organisation))
                ].map((organisation, key) => (
                  <li key={key}>
                    <a href={organisation.discord} target="_blank" rel="noopener noreferrer">
                      {organisation.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" onClick={props.previousStep}>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={props.nextStep}>
            Next
            <i className="fa fa-arrow-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

function ReportPartnerOrganisations(props) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">Reporting Partner Organisations</h3>
          <h6>Reporting Partner Organisations to Offworld Industries</h6>
          <p>
            If you believe that one of our partner organisations has breached one Offworld
            Industries' server licensing guidelines or Offworld Industries' Code of Conduct by
            banning you, then you may wish to consider reporting them to Offworld Industries.
          </p>
          <p>
            To do this, email{' '}
            <a
              href="mailto:Licensing@offworldindustries.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Licensing@offworldindustries.com
            </a>{' '}
            with the following details:
          </p>
          <ul className="font-weight-light">
            <li>The name of the server.</li>
            <li>Any evidence, such as videos and pictures.</li>
            <li>Date and time of the incident.</li>
          </ul>
          <p>
            Alternatively/additionally you can fill out the following their report form located{' '}
            <a href="https://forms.gle/R3D434WVuaY9obtT6" target="_blank" rel="noopener noreferrer">
              here
            </a>
            .
          </p>
          <h6>Reporting Partner Organisations to GameBans.org</h6>
          <p>
            Our system has methods to prevent a single partner organisation abusing our system to
            ban you from other servers. However, if you believe that a partner organisation has
            found a way to abuse the system you may report your concerns to our developers,
            who can be found via our <a href={DISCORD_INVITE}>Discord</a>.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" onClick={props.previousStep}>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={props.nextStep}>
            Next
            <i className="fa fa-arrow-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

function FurtherHelp(props) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-center">Further Help</h3>
          <p>
            Thank you <strong>{props.steamUser?.name || ''}</strong> for taking the time to read through the information
            we have provided. If you require further assistance, please read our <Link to="/faq">FAQ</Link> and then
            seek further help on our <a href={DISCORD_INVITE}>Discord</a>.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-left">
          <Button color="default" onClick={props.previousStep}>
            <i className="fa fa-arrow-left mr-2" />
            Back
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default function (props) {
  const search = props.match.params.steamUser;
  const isValidSteam64ID = search && search.match(/^[0-9]{17}$/);

  const { loading, error, data } = isValidSteam64ID
    ? useQuery(GET_PLAYER, { variables: { id: search } })
    : { loading: null, error: null, data: null };

  return (
    <Layout>
      <section className="section section-lg pt-lg-0 mt--200">
        <Container>
          <Card className="shadow border-0">
            <CardBody className="pt-5 pb-2 border-bottom">
              <div className="icon icon-shape bg-gradient-warning rounded-circle text-white mb-4">
                <i className="fa fa-life-ring" />
              </div>
              <h6 className="text-warning text-uppercase">I'm banned, what now?</h6>
              <p className="description mt-2">
                Get information on how to get unlisted from or unbanned by GameBans.org.
              </p>
            </CardBody>
            <CardBody>
              {loading && (
                <>
                  <div className="text-center mt-2 mb-3">Loading...</div>
                  <div className="btn-wrapper text-center">
                    <i className="fas fa-circle-notch fa-spin fa-4x" />
                  </div>
                </>
              )}
              {error && (
                <>
                  <div className="text-center mt-2 mb-2">Error!</div>
                  <div className="btn-wrapper text-center">
                    <i className="fas fa-exclamation-triangle fa-4x" />
                  </div>
                  <div className="text-center mt-2 mb-2">Something went wrong. Sad times.</div>
                </>
              )}
              {!loading && !error && (
                <Jumbotron className="mb-0 bg-white">
                  <StepWizard>
                    {!isValidSteam64ID && <EnterSteamUser />}
                    <Foreword steamUser={data?.steamUser} isValidSteam64ID={isValidSteam64ID} />
                    <WhatIsTheSquadCommunityBanList />
                    <GettingUnlistedFromTheSquadCommunityBanList steamUser={data?.steamUser} />
                    <GettingUnbannedFromTheSquadCommunityBanList steamUser={data?.steamUser} />
                    <ReportPartnerOrganisations />
                    <FurtherHelp steamUser={data?.steamUser} />
                  </StepWizard>
                </Jumbotron>
              )}
            </CardBody>
          </Card>
        </Container>
      </section>
    </Layout>
  );
}
