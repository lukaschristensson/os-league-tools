import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import RegionsTracker from "../components/RegionsTracker";
import RelicsTracker from "../components/RelicsTracker";
import TaskTracker from "../components/TaskTracker";
import useLocalStorage from "../hooks/useLocalStorage";
import useQueryString from "../hooks/useQueryString";
import { LOCALSTORAGE_KEYS } from "../util/browser-util";
import { INITIAL_TASKS_STATE } from "../util/task-util";
import { INITIAL_REGIONS_STATE } from '../util/region-util';
import ReactGA from 'react-ga';

ReactGA.pageview(window.location.pathname + window.location.search);

export default function CharacterTracker() {
    const [selectedTab, onSetSelectedTab] = useQueryString('tab');
    const [taskStatus, setTaskStatus] = useLocalStorage(LOCALSTORAGE_KEYS.TASKS, INITIAL_TASKS_STATE);
    const [unlockedRegions, setUnlockedRegions, refreshRegionState] = useLocalStorage(LOCALSTORAGE_KEYS.UNLOCKED_REGIONS, INITIAL_REGIONS_STATE);

    return (
        <div className="content-wrapper mb-4">
            <h1 className="mt-2 light-text text-center">Character Tracker</h1>
            <Tabs fill variant="pills" defaultActiveKey={selectedTab} className="mt-3 tab-bar-dark" onSelect={onSetSelectedTab}>
                {/* <Tab eventKey="overview" title="Character Overview">
                    <Card bg='dark' text='white' className="mt-3">
                        <div className="m-3 text-center">
                            TODO
                        </div>
                    </Card>
                </Tab> */}
                <Tab eventKey="relics" title="Relics">
                    <RelicsTracker totalPoints={taskStatus.points} />
                </Tab>
                <Tab eventKey="regions" title="Regions">
                    <RegionsTracker
                        totalTasks={taskStatus.taskCount.total}
                        unlockedRegions={unlockedRegions}
                        setUnlockedRegionsCallback={setUnlockedRegions}
                        refreshRegionState={refreshRegionState}
                    />
                </Tab>
                <Tab eventKey="tasks" title="Tasks">
                    <TaskTracker
                        taskStatus={taskStatus}
                        updateTaskStatusCallback={setTaskStatus}
                        unlockedRegions={unlockedRegions}
                    />
                </Tab>
            </Tabs>
        </div >
    );
}
