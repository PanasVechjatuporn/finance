import './App.css';
import Navigate from './components/Navbar';
import IndividualIntervalsExample from './components/Carousel';
import {React} from 'react';

function Dashboard() {

    return (
        <React.Fragment>
            <div>
                <div className='header'>
                    <Navigate />
                </div>
                <div>
                    <IndividualIntervalsExample />
                </div>
            </div>
        </React.Fragment>
    );
}

export default Dashboard;
