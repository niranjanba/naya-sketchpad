import styled from "styled-components";
import SketchPad from "../components/SketchPad";
import Sketches from "../components/Sketches";
import User from "../components/Users";
import Header from "../components/Header";
function SketchPage() {
    return (
        <SketchPageWrapper>
            <Header />
            <div className="main">
                <SketchPad />
                <div className="side-menu">
                    <Sketches />
                    <User />
                </div>
            </div>
        </SketchPageWrapper>
    );
}

const SketchPageWrapper = styled.div`
    height: 100%;
    .main {
        margin: 2rem;
        display: grid;
        grid-template-columns: 2fr 1fr;
    }
`;

export default SketchPage;
