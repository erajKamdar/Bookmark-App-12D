import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Bookmarks from '../components/Bookmarks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      textAlign: "center",
    },
    parent: {
      textAlign: "center",
    },
    heading: {
      marginTop: "80px",
      color: "purple",
      letterSpacing: '2px'
    }
  })
);

const IndexPage = () => {
  const classes=useStyles();
  return (
    <div className={classes.parent}>
      <title>Bookmarks</title>
      <h1 className={classes.heading}>BOOKMARKS</h1>
      <Bookmarks />
    </div>
  );
};

export default IndexPage;