import React, { useContext } from 'react';
import Container from '../Container';
import { MemberFormsContext } from '../../context';

import { ReactComponent as ColumnIcon } from '../../assets/column.svg';
import { ReactComponent as FormIcon } from '../../assets/form.svg';
import { ReactComponent as MoneyIcon } from '../../assets/money.svg';

import './Home.sass';

const Home = () => {
  const { setShowMemberForms, setShowLogin } = useContext(MemberFormsContext);

  return (
    <main className="home">
      <Container>
        <header className="home__header">
          <h1 className="home__title">Blogggly</h1>
          <h3 className="home__subtitle">Start your own blog in seconds, for free!</h3>
          <button
            className="btn btn--success"
            type="button"
            onClick={() => {
              setShowLogin(false);
              setShowMemberForms(true);
            }}
          >
            Signup
          </button>
        </header>
      </Container>
      <Container>
        <section className="features">
          <div className="features__card">
            <ColumnIcon className="features-card__icon" />
            <h3>Start your personal blog and share your stories!</h3>
          </div>
          <div className="features__card">
            <FormIcon className="features-card__icon" />
            <h3>Rich text editor!</h3>
          </div>
          <div className="features__card">
            <MoneyIcon className="features-card__icon" />
            <h3>Completely free!</h3>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default Home;
