import React from 'react';

import './user.css';

export default ({user, userFriends}) => {
    return (
        <div className='user-card'>
            <div className='user-card__name'>{user.first_name} {user.last_name}</div>
            {(userFriends.length !== 0) && (
                <div className="user-card__friends">
                    <div className="user-card__friends-title">Your friends</div>
                    {userFriends.map(({id, first_name, last_name}) =>
                        <div key={id} className="user-card__friend">{first_name} {last_name}</div>
                    )}
                </div>
            )}
        </div>
    )
}