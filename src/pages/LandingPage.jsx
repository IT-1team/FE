import React from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from '../components/common/KanbanBoard';
import Circle from '../components/common/Circle';
import ProgressBar from '../components/common/ProgressBar';
import { IoSearchOutline } from 'react-icons/io5';
import { FaUserGroup } from 'react-icons/fa6';
import { TbAddressBook } from 'react-icons/tb';
import { TbSpeakerphone } from 'react-icons/tb';
import { TbArticle } from 'react-icons/tb';
import { FcBullish } from 'react-icons/fc';
import { FcBusinesswoman } from 'react-icons/fc';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { MdOutlinePersonOutline } from 'react-icons/md';
import { BsPersonCheck } from 'react-icons/bs';
import '../styles/LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-boards">
        <div className="landing-boards-group">
          <div className="medium-board">
            <KanbanBoard
              size="medium"
              profileImage="https://picsum.photos/800/800"
              profileAlt="프로필"
              userName="창다은"
              department="서한ENP"
              team="인사팀"
            />
            <div className="progress-section">
              <ProgressBar
                label="휴가신청현황"
                current={3}
                total={15}
                color="#F472B6"
              />
              <ProgressBar
                label="학점현황"
                current={73}
                total={120}
                color="#60A5FA"
              />
            </div>
            <div className="icon-circles">
              <Circle icon={TbAddressBook} size="xs" label="신청내역" />
              <Circle icon={TbSpeakerphone} size="xs" label="공지사항" />
              <Circle icon={TbArticle} size="xs" label="설문조사" />
            </div>
            <div className="small-boards">
              <KanbanBoard
                size="xs-small"
                userName="My Team"
                icon={FaUserGroup}
              />
              <KanbanBoard
                size="xs-small"
                userName="Payments"
                icon={IoSearchOutline}
              />
            </div>
          </div>
        </div>
        <div className="large-board-container">
          <KanbanBoard
            size="large"
            title="조직의 성장"
            titleColor="#0A4EA2"
            icon={FcBullish}
          />
          <div className="large-board-circles">
            <Link to="/dashboard/registration" className="circle-link">
              <Circle
                icon={MdOutlinePersonAddAlt}
                size="xs"
                label="우수인재확보"
                labelPosition="side"
              />
            </Link>
            <Link to="/dashboard/search" className="circle-link">
              <Circle
                icon={MdOutlinePersonOutline}
                size="xs"
                label="사원조회"
                labelPosition="side"
              />
            </Link>
          </div>
        </div>
        <div className="large-board-container">
          <KanbanBoard
            size="large"
            title="개인의 성장"
            titleColor="#0A4EA2"
            icon={FcBusinesswoman}
          />
          <div className="personal-board-circles">
            <Link to="/dashboard/attendance" className="circle-link">
              <Circle
                icon={BsPersonCheck}
                size="xs"
                label="근태조회"
                labelPosition="side"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="landing-boards-bottom">
        <KanbanBoard size="small" />
      </div>
    </div>
  );
};

export default LandingPage;
