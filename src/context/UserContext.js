import React, { useState, useContext } from 'react';

const UserContext = React.createContext([{}, () => {}]);

const UserProvider = (props) => {
    const [state, setState] = useState({
        username: '',
        email: '',
        uid: '',
        isLoggedIn: null,
        posts: []
    });

    return (
        <UserContext.Provider value={[state, setState]}>
            {props.children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
