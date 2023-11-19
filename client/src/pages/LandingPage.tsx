import { Typography, Box, Avatar, Button } from "@mui/material";
import React, { useState } from "react";
import { useGetBusinesses } from "../requests/business";
import { filledButtonStyle, textButtonStyle } from "../styles/commonStyles";
import { useNavigate } from "react-router-dom";
import { useGetCustomerInfo } from "../requests/users";
const LandingPage: React.FC = () => {
  const { data: businessesData, isLoading: isBusinessesDataLoading } =
    useGetBusinesses();

  const { data: customerData, isLoading: isCustomerDataLoading } =
    useGetCustomerInfo() as { data: any; isLoading: boolean };

  const navigate = useNavigate();

  return (
    <div
      style={{
        background: `var(--color-gray1)`,
        overflowY: "auto",
        height: "100vh",
        padding: "0 20px 20px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          // position: "relative",
          paddingTop: "20px",
          paddingLeft: "30px",
          paddingBottom: "10px",
          paddingRight: "50px",
          borderRadius: "0 0 32px 32px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            fontWeight="bold"
            sx={{ color: "var(--color-pink1)" }}
          >
            ScheduleIT
          </Typography>
          <Box>
            {!isCustomerDataLoading && !customerData?.data?.valid && (
              <>
                <Button
                  variant="text"
                  sx={textButtonStyle}
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  sx={filledButtonStyle}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
            {!isCustomerDataLoading && customerData?.data?.valid && (
              <>
                <Button
                  variant="text"
                  sx={textButtonStyle}
                  //todo implement later
                  // onClick={() => navigate("/signup")}
                >
                  Log Out
                </Button>
                <Button
                  variant="contained"
                  sx={filledButtonStyle}
                  //todo implement later
                  // onClick={() => navigate("/signup")}
                >
                  Appointments
                </Button>
              </>
            )}
          </Box>
        </Box>
      </div>

      <Box
        sx={{
          py: 4,
          paddingLeft: "0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <Typography
            variant="body2"
            color="var(--color-pink1)"
            sx={{ paddingLeft: "20px" }}
          >
            Suggested Businesses
          </Typography>

          <Box
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              padding: "24px 24px 24px",
              backgroundColor: "white",
              borderRadius: "32px 32px 32px 32px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                gap: "10px",
              }}
            >
              {!isBusinessesDataLoading &&
                businessesData.data?.map((business, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexFlow: "column nowrap",
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        backgroundColor: "var(--color-gray1)",
                        borderRadius: "18px",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "200px",
                          padding: "10px 10px 10px",
                          backgroundColor: "var(--color-blue1)",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundBlendMode: "multiply",
                        }}
                      >
                        <Avatar
                          alt="Business Logo"
                          sx={{
                            height: "auto",
                            border: "15px solid white",
                            width: "40%",
                            aspectRatio: "1/1",
                          }}
                        />
                      </div>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "15px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          component="div"
                          color="var(--color-pink1)"
                          sx={{ mb: 0 }}
                        >
                          {business.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0 }}
                        >
                          description
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </div>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
export default LandingPage;
