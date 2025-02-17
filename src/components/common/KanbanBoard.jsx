import React from 'react';
import '../../styles/KanbanBoard.scss';
import Circle from './Circle';

const KanbanBoard = ({
  size = 'medium',
  profileImage,
  profileAlt,
  userName,
  department,
  team,
  icon: IconComponent,
  title,
  titleColor = '',
}) => {
  return (
    <div className={`kanban-board kanban-board--${size}`}>
      <div className="kanban-board__column">
        {title && (
          <div className="kanban-board__main-title">
            {IconComponent && (
              <div className="main-title-icon">
                <IconComponent size={100} />
              </div>
            )}
            <h2 className="main-title-text" style={{ color: titleColor }}>
              {title.includes('의') ? (
                <>
                  {title.split('의')[0]}의
                  <br />
                  <span className="highlight-text">{title.split('의')[1]}</span>
                </>
              ) : (
                title
              )}
            </h2>
          </div>
        )}
        {profileImage ? (
          <div className="kanban-board__profile">
            <Circle
              src={profileImage}
              alt={profileAlt || '프로필 이미지'}
              size="lg"
            />
            <div className="kanban-board__user-info">
              <h3 className="user-name">{userName}</h3>
              <p className="user-department">{department}</p>
              <p className="user-team">{team}</p>
            </div>
          </div>
        ) : (
          userName && (
            <div className="kanban-board__title">
              {IconComponent && (
                <IconComponent size={24} className="title-icon" />
              )}
              <div className="title-text">{userName}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default KanbanBoard;
