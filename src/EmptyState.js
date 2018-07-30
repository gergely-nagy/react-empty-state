import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = (props) => {
  return (
    <div className="empty-state animated fadeIn">
      {props.hasImage &&
        <img
          className="img-avatar"
          alt="img-avatar"
        />
      }
      <h3>{props.title}</h3>
      <p>{props.subtitle}</p>
      <button
        onClick={props.submitClick}
      >
        {props.btnText}
      </button>
    </div>
  );
};

EmptyState.propTypes = {
  hasImage: PropTypes.bool,
  submitClick: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  btnText: PropTypes.string,
};


EmptyState.defaultProps = {
  hasImage: false,
  title: 'Hálozati hiba',
  subtitle: 'Hálozati hiba miatt nem sikerült kapcsolódni a szerverhez. Kérem, próbálkozzon újra!',
  btnText: 'Próbáld újra!'
};

export default EmptyState;
