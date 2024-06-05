import React from "react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { styled } from '@mui/system';

const MessageRow = styled('div')({
  display: "flex",
});

const MessageRowRight = styled('div')({
  display: "flex",
  justifyContent: "flex-end",
});

const MessageBlue = styled('div')({
  position: "relative",
  marginLeft: "20px",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#A8DDFD",
  width: "60%",
  textAlign: "left",
  font: "400 .9em 'Open Sans', sans-serif",
  border: "1px solid #97C6E3",
  borderRadius: "10px",
  "&:after": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "15px solid #A8DDFD",
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    top: "0",
    left: "-15px",
  },
  "&:before": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "17px solid #97C6E3",
    borderLeft: "16px solid transparent",
    borderRight: "16px solid transparent",
    top: "-1px",
    left: "-17px",
  },
});

const MessageOrange = styled('div')({
  position: "relative",
  marginRight: "20px",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#f8e896",
  width: "60%",
  textAlign: "left",
  font: "400 .9em 'Open Sans', sans-serif",
  border: "1px solid #dfd087",
  borderRadius: "10px",
  "&:after": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "15px solid #f8e896",
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    top: "0",
    right: "-15px",
  },
  "&:before": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "17px solid #dfd087",
    borderLeft: "16px solid transparent",
    borderRight: "16px solid transparent",
    top: "-1px",
    right: "-17px",
  },
});

const MessageContent = styled('p')({
  padding: 0,
  margin: 0,
});

const MessageTimeStampRight = styled('div')({
  position: "absolute",
  fontSize: ".85em",
  fontWeight: "300",
  marginTop: "10px",
  bottom: "-3px",
  right: "5px",
});

const DisplayName = styled('div')({
  marginLeft: "20px",
});

const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  const displayName = props.displayName ? props.displayName : "名無しさん";

  return (
    <>
      <MessageRow>
        <Avatar
          alt={displayName}
          sx={{ bgcolor: deepOrange[500] }}
          src={photoURL}
        />
        <div>
          <DisplayName>{displayName}</DisplayName>
          <MessageBlue>
            <div>
              <MessageContent>{message}</MessageContent>
            </div>
            <MessageTimeStampRight sx={{marginBottom:"6px"}}>{timestamp}</MessageTimeStampRight>
          </MessageBlue>
        </div>
      </MessageRow>
    </>
  );
};

const MessageRight = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <MessageRowRight>
      <MessageOrange>
        <MessageContent>{message}</MessageContent>
        <MessageTimeStampRight sx={{marginBottom:"6px"}}>{timestamp}</MessageTimeStampRight>
      </MessageOrange>
    </MessageRowRight>
  );
};

export { MessageLeft, MessageRight };
