import { getDaoSnapshot } from "@/lib/dao";
import WalletConnectButton from "@/components/WalletConnectButton";
import ProposalList from "@/components/ProposalList";
import WalletVotingStatusClient from "@/components/WalletVotingStatusClient";

export default async function Home() {
  const snapshot = await getDaoSnapshot();

  return (
    <div className="page">
      <header className="nav">
        <div className="logo">
          <div className="logoMark" aria-hidden="true" />
          Capstone DAO
        </div>
        <nav className="navLinks">
          <a href="#proposals">Proposals</a>
          <a href="#treasury">Treasury</a>
          <a href="#governance">Governance</a>
          <a href="#security">Security</a>
        </nav>
        <div className="walletButton">
          <WalletConnectButton />
        </div>
      </header>

      <main className="section">
        <section className="hero" id="connect">
          <div>
            <span className="eyebrow">Token Governed Treasury</span>
            <h1 className="headline">
              Collective control over every treasury dollar.
            </h1>
            <p className="subhead">
              Proposals start a transparent vote, power is snapshotted at block
              creation, and every execution waits behind a 48 hour timelock.
            </p>
            {!snapshot.isConfigured ? (
              <p className="subhead">
                Configure contract addresses to show live on-chain data.
              </p>
            ) : null}
            <div className="ctaRow">
              <a className="button" href="#proposals">
                View Live Proposals
              </a>
              <a className="button buttonGhost" href="#treasury">
                Fund the Treasury
              </a>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="statLabel">Treasury Balance</div>
              <div className="statValue">{snapshot.treasuryEth}</div>
            </div>
            <div className="stat">
              <div className="statLabel">Total Supply</div>
              <div className="statValue">{snapshot.totalSupply}</div>
            </div>
            <div className="stat">
              <div className="statLabel">Timelock Delay</div>
              <div className="statValue">{snapshot.timelockDelay}</div>
            </div>
          </div>
        </section>

        <section className="walletPanel">
          <WalletVotingStatusClient />
        </section>

        <section className="section" id="proposals">
          <div className="sectionHeader">
            <div>
              <div className="pill">Live</div>
              <h2 className="sectionTitle">Active proposals</h2>
            </div>
            <a className="button buttonGhost" href="#">
              New Proposal
            </a>
          </div>
          <ProposalList />
        </section>

        <section className="section" id="treasury">
          <div className="sectionHeader">
            <div>
              <div className="pill">Treasury</div>
              <h2 className="sectionTitle">Assets secured by the timelock</h2>
            </div>
            <span className="pill">{snapshot.chainName}</span>
          </div>
          <div className="grid">
            <article className="card">
              <div className="cardTitle">ETH Reserve</div>
              <div className="cardMeta">
                {snapshot.treasuryEth} · Multisig backup
              </div>
              <div className="cardMeta">Last inflow: 4 hours ago</div>
            </article>
            <article className="card">
              <div className="cardTitle">Stablecoin Buffer</div>
              <div className="cardMeta">92,000 DAI · 6 contributors</div>
              <div className="cardMeta">Auto stream approvals enabled</div>
            </article>
            <article className="card">
              <div className="cardTitle">Yield Strategy</div>
              <div className="cardMeta">Aave V3 · Net APY 3.4%</div>
              <div className="cardMeta">Risk cap: 15% of treasury</div>
            </article>
          </div>
        </section>

        <section className="section" id="governance">
          <div className="sectionHeader">
            <div>
              <div className="pill">Workflow</div>
              <h2 className="sectionTitle">How proposals move</h2>
            </div>
          </div>
          <div className="timeline">
            <div className="step">
              <span>Step 1</span>
              <strong>Propose</strong>
              <p>Submit a transaction bundle with on-chain calldata.</p>
            </div>
            <div className="step">
              <span>Step 2</span>
              <strong>Vote</strong>
              <p>Snapshot voting power and collect quorum-backed votes.</p>
            </div>
            <div className="step">
              <span>Step 3</span>
              <strong>Queue</strong>
              <p>Pass proposals enter a 48 hour timelock before execution.</p>
            </div>
            <div className="step">
              <span>Step 4</span>
              <strong>Execute</strong>
              <p>Anyone can execute when the timelock expires.</p>
            </div>
          </div>
        </section>

        <section className="section" id="security">
          <div className="sectionHeader">
            <div>
              <div className="pill">Security</div>
              <h2 className="sectionTitle">Defense in depth</h2>
            </div>
          </div>
          <div className="grid">
            <article className="card">
              <div className="cardTitle">Quorum</div>
              <div className="cardMeta">{snapshot.quorum}</div>
            </article>
            <article className="card">
              <div className="cardTitle">Proposal Threshold</div>
              <div className="cardMeta">{snapshot.proposalThreshold}</div>
            </article>
            <article className="card">
              <div className="cardTitle">Governor</div>
              <div className="cardMeta">{snapshot.governorName}</div>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Capstone DAO · Built for Base</span>
        <span>Auditable, test-driven, community owned</span>
      </footer>
    </div>
  );
}
