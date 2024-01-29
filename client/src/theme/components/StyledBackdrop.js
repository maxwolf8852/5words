import { Backdrop } from "@mui/material";
import { Vortex, Grid, ThreeCircles } from "react-loader-spinner";

const spinners = {
  vortex: (
    <Vortex
      visible={true}
      height="80"
      width="80"
      ariaLabel="vortex-loading"
      wrapperStyle={{}}
      wrapperClass="vortex-wrapper"
      colors={[
        "#F4F44C",
        "#E1E136",
        "#CCCC2D",
        "#A6A621",
        "#F8F873",
        "#8D8D19",
      ]}
    />
  ),
  grid: (
    <Grid
      height="80"
      width="80"
      color="#9b2428"
      ariaLabel="grid-loading"
      radius="12.5"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  ),
  threecircles: (
    <ThreeCircles
      height="100"
      width="100"
      color="#9b2428"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="three-circles-rotating"
      outerCircleColor=""
      innerCircleColor=""
      middleCircleColor=""
    />
  ),
};

const StyledBackdrop = ({ open, type }) => {
  var _type = type ? type : "vortex";
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      //   onClick={handleClose}
    >
      {spinners[_type]}
    </Backdrop>
  );
};

export default StyledBackdrop;
