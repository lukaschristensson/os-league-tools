
import React, { useState } from "react";
import { Card, Row, Col, Tabs, Tab, Nav, Form, Button } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import TaskTable from "./TaskTable";

import DoubleScrollbar from "../components/DoubleScrollbar";

import { isTaskComplete, isTaskCompletable, getFormatters, getRenderers } from "../util/task-util";
import { INITIAL_REGIONS_STATE } from '../util/region-util';
import { LOCALSTORAGE_KEYS, updateLocalStorage, getFromLocalStorage, SESSIONSTORAGE_KEYS } from "../util/browser-util";
import HiscoreLookup from './HiscoreLookup';
import Divider from "./Divider";
import taskData from '../resources/taskData.json';

import useLocalStorage from "../hooks/useLocalStorage";
import useTaskStatus from "../hooks/useTaskStatus";


export default function RandomTaskTab({ refreshHiscores, highscore, unlockedRegions }) {
    const [outsideUnlockedAreas, setOutsideUnlockedAreas] = useLocalStorage(LOCALSTORAGE_KEYS.GRT_TASK_OUTSIDE_UNLOCKED_AREAS, false);
    const [onlyReachedRequirements, setOnlyReachedRequirements] = useLocalStorage(LOCALSTORAGE_KEYS.GRT_TASK_ONLY_REACHED_REQUIRMENTS, false);
    const [excludeLvlExp, setExcludeLvlExp] = useLocalStorage(LOCALSTORAGE_KEYS.GRT_TASK_EXCLUDE_LVL_EXP, true);
    const [currentTaskId, setCurrentTaskId] = useLocalStorage(LOCALSTORAGE_KEYS.GRT_CURRENT_TASK_ID, 0);
    const [taskStatus, setTaskStatus] = useTaskStatus();
    const regionsToShow = ['Common', ...unlockedRegions];
    const taskFilters = []

    taskFilters.push((task) => !isTaskComplete(task.id, taskStatus));
    taskFilters.push((task) => !onlyReachedRequirements || isTaskCompletable(task.id, highscore));
    taskFilters.push((task) => !excludeLvlExp || (!task.name.includes("Level") && !task.name.includes("25 Million")));
    taskFilters.push((task) => outsideUnlockedAreas || regionsToShow.includes(task.area));

    return (
        <Card bg='dark' text='white' style={{ border: '2px solid #6c757d', borderRadius: '0rem 0rem .25rem .25rem' }}>
            <div className="m-3 text-center">
                <Row>
                    <Col lg={2}>
                        Hiscores lookup:
                        <HiscoreLookup refreshStateCallback={refreshHiscores} />
                        <Divider />
                        <h5> Generate Task Options: </h5>
                        <div className="m-3 text-left">
                            <Form.Check
                                label="Include tasks outside unlocked areas"
                                checked={outsideUnlockedAreas}
                                onChange={() => setOutsideUnlockedAreas(outsideUnlockedAreas => !outsideUnlockedAreas)}
                            />
                            <Form.Check
                                label="Exclude 99 and 25m xp tasks"
                                checked={excludeLvlExp}
                                onChange={() => setExcludeLvlExp(excludeLvlExp => !excludeLvlExp)}
                            />
                            <Form.Check
                                label="Only include tasks with obtained requirements"
                                checked={onlyReachedRequirements}
                                onChange={() => setOnlyReachedRequirements(onlyReachedRequirements => !onlyReachedRequirements)}
                            />
                        </div>
                    </Col>
                    <Col lg={10}>
                        <h3>Your Current Task:</h3>
                        <Card bg='dark' text='white' style={{ border: '3px solid #6c757d', borderRadius: '1rem 1rem 1rem 1rem', marginBottom: 25 }}>
                            <>
                                <div className="m-3 text-center" style={{ minHeight: 120 }}>
                                    {!(taskData.tasksById[currentTaskId] === undefined) &&
                                        <>
                                            <b style={{ fontSize: 24, marginBottom: 10 }}>
                                                {`${taskData.tasksById[currentTaskId].difficulty} task`}
                                            </b>
                                            <div>
                                                {`${taskData.tasksById[currentTaskId].name}: ${taskData.tasksById[currentTaskId].description}`}
                                            </div>
                                        </>
                                    }
                                    {(taskData.tasksById[currentTaskId] === undefined) &&
                                        <div>
                                            {`No active task, click "Generate new task" to get your next task!`}
                                        </div>
                                    }
                                </div>
                                <div className="m-3 text-center">
                                    <Button style={{ maxWidth: 200, marginRight: 20, backgroundColor: '#4a535b' }} onClick={() => {
                                        const taskPool = taskData.tasks.filter(t => { return taskFilters.reduce((finalBool, f) => finalBool && f(t), true); });
                                        const newTask = taskPool[Math.floor(Math.random() * taskPool.length)];
                                        document.getElementById('completeTaskBtn').disabled = false;
                                        setCurrentTaskId(newTask.id);
                                    }}>
                                        Generate new task
                                    </Button>
                                    <Button id='completeTaskBtn' bc='Green' style={{ maxWidth: 200, backgroundColor: 'green' }} onClick={() => {
                                        document.getElementById('completeTaskBtn').disabled = true;
                                        setTaskStatus.setCompleted(currentTaskId, true);
                                        setCurrentTaskId(-1);
                                    }}>
                                        Complete task
                                    </Button>
                                </div>
                            </>
                        </Card>

                    </Col>
                </Row>
            </div>
        </Card >
    );
}