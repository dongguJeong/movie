import styled from "styled-components";
import { AnimatePresence, motion, spring, stagger } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  getComingSoon,
  getMovie,

  IAPIResponse,
  IMovieDetail,
  makeImagePath
} from "../api";
import { useEffect } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  height: 200vh;
`;

const Container = styled(motion.div)`
  max-width : 90%;
  display: grid;

  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10%;
  margin : 0 auto;
  padding-left : 2%;
  

`;

const MovieContainer = styled(motion.div)<{ bgPath: string }>`
  max-width: 200px;
  height: 300px;
  background-color: red;
  border-radius: 10px;
  background-image: url(${(props) => props.bgPath});
  background-size: cover;
  background-position: center center;
  position: relative;
  cursor : pointer;
`;

const movieVar = {
  start: { scale: 0, opacity: 0 },
  end: {
    scale: 1,
    opacity: 1
  }
};

const containerVar = {
  start: {
    opacity: 0
  },
  end: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
};

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  position: absolute;
  bottom: -60px;
  font-size: 20px;
  max-width: 200px;
  height: 30px;
  
  display: flex;
  justify-content: center;
  align-items : center;
  
`;

const DetailBox = styled(motion.div)`
  position: fixed;
  top: 10vh;
  left: 33%;
  background-color: #171617;
  max-width: 500px;
  height: 600px;
  border-radius: 15px;
  overflow : scroll;
`;

const DetailContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
`;

const DetailInnerContainer = styled(motion.div)`
  
`;

const DetailImg = styled(motion.div)`
  position: relative;
  width: 100%;
  background-size: cover;
  height: 50%;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;

const DetailBtn = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: absolute;
  width: 3vw;
  height: 3vw;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const DetailTitle = styled(motion.div)`
  
  font-size: 36px;
  font-weight: 600;
  padding: 7px 20px;
`;

const DetailOverview = styled(motion.div)`
  font-size: 15px;
  padding: 7px 20px;
`;

const DetailGenre = styled(DetailOverview)`
  display: flex;
  li {
    margin-right: 10px;
  }
`;

const DetailOthers = styled(motion.div)`
  font-size: 15px;
  padding: 7px 20px;
  

  li {
    margin-bottom: 7px;
  }
`;

function Coming() {
  const Movies = useQuery<IAPIResponse>(["movies", "playing"], getComingSoon);
  const movePage = useNavigate();
  
  const movieMatch = useMatch("coming-soon/movies/:id");

  
  const Details = useQuery<IMovieDetail>(["movies", "detail"], () =>
    getMovie(movieMatch?.params.id || " ")
  );

  useEffect(() => {
    Details.refetch();
  }, [movieMatch?.params.id]);


  const findMovie  =
    movieMatch?.params.id &&
    Movies.data?.results.find( (movie) => movie.id+"" === movieMatch?.params?.id) ;

  const handleClick = (id: string) => {
    movePage(`movies/${id}`);
  };

  const goBack = () => {
    movePage("/coming-soon");
  };


  return (
    <Wrapper>
      {Movies?.isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <Container variants={containerVar} animate="end" initial="start">
          {Movies?.data?.results.map((movie) => (
            <MovieContainer
              onClick={() => handleClick(movie.id + "")}
              variants={movieVar}
              layoutId={movie.id + ""}
              whileHover={{
                y: -20,
                scale: 1.1
              }}
              bgPath={makeImagePath(movie.poster_path)}
              key={movie.id}
            >
              <Title>{movie.title}</Title>
            </MovieContainer>
          ))}
          <AnimatePresence>
            {movieMatch ? (
              <Overlay onClick={goBack}>
                <DetailBox layoutId={movieMatch.params.id}>
                  <DetailContainer>
                    <DetailImg
                      style={{
                        backgroundImage: findMovie
                          ? `linear-gradient(transparent, #171617), url(${makeImagePath(
                              findMovie.backdrop_path
                            )})`
                          : "none"
                      }}
                    ></DetailImg>

                    <DetailBtn onClick={goBack}>X</DetailBtn>
                    
                    <DetailInnerContainer>
                    <DetailTitle>{findMovie && findMovie.title}</DetailTitle>

                    <DetailGenre>
                      {findMovie &&
                        Details.data?.genres?.map((genre) => (
                          <li>{genre.name}</li>
                        ))}
                    </DetailGenre>

                    <DetailOverview>
                      {findMovie && findMovie.overview}
                    </DetailOverview>

                    <DetailOthers>
                      <ul>
                        <li>Budget : ${Details.data?.budget}</li>
                        <li>Revenue : ${Details.data?.revenue}</li>
                        <li>Runtime : {Details.data?.runtime} minutes</li>
                        <li>
                          Rating :{" "}
                          {Math.round( (Details.data?.vote_average || 0 ) * 10) / 10}
                        </li>
                      </ul>
                    </DetailOthers>
                    </DetailInnerContainer>
                  </DetailContainer>
                </DetailBox>
              </Overlay>
            ) : null}
          </AnimatePresence>
        </Container>
      )}
    </Wrapper>
  );
}

export default Coming;
