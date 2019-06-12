import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import Container from '../Container';
import { MemberFormsContext } from '../../context';
import Button from '../Button';

import { ReactComponent as ColumnIcon } from '../../assets/column.svg';
import { ReactComponent as FormIcon } from '../../assets/form.svg';
import { ReactComponent as MoneyIcon } from '../../assets/money.svg';

import './Home.sass';

const Home = () => {
  const { setShowMemberForms, setShowLogin } = useContext(MemberFormsContext);

  return (
    <div className="home">
      <Helmet>
        <title>Blogggly</title>
      </Helmet>
      <Container>
        <header className="home__header animated zoomIn fast">
          <h1 className="home__title animated delay-500ms fadeInUp">Blogggly</h1>
          <h3 className="home__subtitle delay-700ms animated fadeInUp">Start your own blog in seconds, for free!</h3>
          <Button
            classes="btn btn--primary delay-700ms animated fadeInUp"
            text="Signup"
            onClick={() => {
              setShowLogin(false);
              setShowMemberForms(true);
            }}
          />
        </header>
      </Container>
      <Container>
        <section className="features">
          <div className="features__card delay-200ms animated fadeInUp">
            <ColumnIcon className="features-card__icon" />
            <h3>Start your personal blog and share your stories!</h3>
          </div>
          <div className="features__card delay-400ms animated fadeInUp">
            <FormIcon className="features-card__icon" />
            <h3>Rich text editor!</h3>
          </div>
          <div className="features__card delay-600ms animated fadeInUp">
            <MoneyIcon className="features-card__icon" />
            <h3>Completely free!</h3>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Home;
