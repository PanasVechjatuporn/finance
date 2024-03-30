import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
export const NormalGoalCreateNew = ({ currentStep, setCurrentStep, goalData, setGoalData }) => {
  //Step 1
  return (
    <Container
      sx={{
        marginTop: 5,
        minHeight: "100vh",
        display: "ruby-text",
      }}
    >
      <Box
        sx={{
          minWidth: "90%",
          minHeight: "90%",
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: 6,
          boxShadow: 6,
          padding: 4,
          position: "relative",
          overflow: "auto",
          justifyContent: "center",
        }}
      >
        <div>
          <Typography
            variant="h5"
            style={{
              color: "#757575",
              textDecoration: "underline",
              textDecorationColor: "transparent",
              borderBottom: "2px solid #757575",
              width: "100%",
              paddingBottom: "8px",
              userSelect: "none",
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            Step 1 สร้างเป้าหมายของคุณ
          </Typography>
        </div>
        <Container>
            {JSON.stringify(goalData)}
        </Container>
        <Container>
          <Button
            variant="contained"
            endIcon={<NavigateNextIcon />}
            onClick={(e) => {
              console.log("next Clicked");
              setCurrentStep((currentStep += 1));
            }}
          >
            Next
          </Button>
        </Container>
      </Box>
    </Container>
  );
};
