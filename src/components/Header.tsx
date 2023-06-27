import styled from "styled-components";
import { Link, useMatch } from "react-router-dom";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  width: 100%;
  height: 15vh;
  
`;

const Container = styled.div`
  
  width : 50%;
  height : 100%;
  margin-left : 27%;
  padding-top : 20px;
`;

const Items = styled.ul`
  display: flex;
  justify-content : space-evenly;
`;

const Item = styled(motion.li)`
  
  display: flex;
  flex-direction: column;
  align-items: center;


`;

const Circle = styled(motion.div)`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: red;
  margin-top: 10px;
`;

function Header() {
  const Popularmatch = useMatch("/");
  const Comingmatch = useMatch("/coming-soon");
  const Nowmatch = useMatch("/now-playing");

  return (
    <Wrapper>
      <Container>
        <Items>
          <Item whileHover={{ scale: 1.1 }}>
            <Link to={"/"}>Popular</Link>
            {Popularmatch ? <Circle layoutId="circle" /> : null}
          </Item>
          <Item whileHover={{ scale: 1.1 }}>
            <Link to={"/coming-soon"}>Coming soon</Link>
            {Comingmatch ? <Circle layoutId="circle" /> : null}
          </Item>
          <Item whileHover={{ scale: 1.1 }}>
            <Link to={"/now-playing"}>Now Playing</Link>
            {Nowmatch ? <Circle layoutId="circle" /> : null}
          </Item>
        </Items>
      </Container>
    </Wrapper>
  );
}

export default Header;
