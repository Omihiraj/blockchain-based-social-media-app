import React from "react";
import "./Widgets.css";
import {
  TwitterHashtagButton,
  TwitterTimelineEmbed
} from "react-twitter-embed";
import SearchIcon from "@material-ui/icons/Search";

function Widgets() {
  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder="Search Twitter" type="text" style={{ border: 'none', outline: 'none', }} />
      </div>

      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>

        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="mihiraj"
          options={{ height: 700 }}
        />


      </div>
    </div>
  );
}

export default Widgets;
