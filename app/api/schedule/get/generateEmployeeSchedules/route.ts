import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { findAndDecodePath } from '@/app/lib/utility/pathFinder';

export const dynamic = 'force-dynamic';

type Assignment = {
  employeeId: number;
  applicationId: number;
  startTime: string;
  endTime: string;
};

// Helper functions
const getCurrentISODateInMoscow = (): string => {
  const now = new Date(); 
  const moscowOffset = 3 * 60 * 60000; 
  const moscowTime = new Date(now.getTime() + moscowOffset);
  return moscowTime.toISOString();
};

const getCurrentDateInMoscow = (): Date => {
  const now = new Date();
  const moscowOffset = 3 * 60 * 60000;
  const moscowTime = new Date(now.getTime() + moscowOffset);
  return moscowTime;
};

const getStartOfDayInMoscow = (date: Date): Date => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0); 
  return startOfDay;
};

const getEndOfDayInMoscow = (date: Date): Date => {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999); 
  return endOfDay;
};

const getTomorrowInMoscow = (): Date => {
  const moscowToday = getCurrentDateInMoscow();
  const tomorrow = new Date(moscowToday);
  tomorrow.setDate(moscowToday.getDate() + 1);
  return tomorrow;
};

const getCurrentMoscowOffsetHours = () => {
    const now = new Date(); // Current date and time in UTC
    const moscowOffset = 3; // Moscow is UTC+3
    return moscowOffset; // Return as ISO string
  };


// Helper function to get an application by ID
const getAppById = async (appId: number) => {
    return await prisma.application.findUnique({
      where: {
        id: appId,
      },
    });
  };
  
// Helper function to get a station by ID
const getStationById = async (stationId: number) => {
    return await prisma.station.findUnique({
      where: {
        id: stationId,
      },
    });
};
  
// Function to fetch and sort applications for a given day
const fetchAndSortApplicationsForDay = async (day: Date) => {
    const moscowDay = new Date (day);
    const startOfDay = getStartOfDayInMoscow(moscowDay);
    // console.log('startOfDay', startOfDay)
    const endOfDay = getEndOfDayInMoscow(moscowDay);
    // console.log('endOfDay', endOfDay)

    // console.log(`Day: ${moscowDay.toISOString()}`);



  const applications = await prisma.application.findMany({
    where: {
      datetime: {
        gte: startOfDay.toISOString(),
        lt: endOfDay.toISOString(),
      },
    },
    orderBy: {
      datetime: 'asc',
    },
  });

//   console.log(applications);
  return applications;
};

// Function to fetch available workers
const fetchWorkers = async () => {
  const workers = await prisma.employee.findMany({
    where: {
      shift: {
        in: ['1', '1Н', '2', '2Н'],
      },
      rank: {
        notIn: ['администратор', 'специалист', 'ЦИО', 'ЦУ'],
      },
      workStatus: null,
    },
  });
//   console.log(workers);
  return workers;
};

// Helper function to check if a worker is available for a given application
const isWorkerAvailable = async (worker: any, application: any, assignments: Assignment[]) => {
    if(worker.id == 69 && application.id == 13) {
        console.log('worker.id', worker.id)
    }

    const workStart = worker.timeWork.split('-')[0];
    const workStartHour = parseInt(workStart.split(':')[0]);

    if(worker.id == 69 && application.id == 13) {
        console.log('workStart', workStart)
    }

    const workEnd = worker.timeWork.split('-')[1];
    const workEndHour = parseInt(workEnd.split(':')[0]);
    if(worker.id == 69 && application.id == 13) {
        console.log('workEnd', workEnd)
    }

    if(worker.id == 69 && application.id == 13) {
        console.log('application.id', application.id);
    }

    const appTime = new Date(application.datetime).getUTCHours() + getCurrentMoscowOffsetHours();
    const appTestTime =  new Date(application.datetime).getHours();

    if(worker.id == 69 && application.id == 13) {
        console.log('appTime', appTime);
        console.log('appTestTime', appTestTime);
    }

    const appStartTime = new Date(application.datetime);
    // console.log('appStartTime', appStartTime);
    if(worker.id == 69 && application.id == 13) {
        console.log('appStartTime', appStartTime);
    }

    const appEndTime = new Date(appStartTime.getTime() + application.pathTime * 60000);
    // console.log('appEndTime', appEndTime);
    if(worker.id == 69 && application.id == 13) {
        console.log('appEndTime', appEndTime);
    }

    let appStartHour = appStartTime.getUTCHours() + getCurrentMoscowOffsetHours();
    // appStartHour = appStartHour === 0 ? 24 : appStartHour;
    const appStartMinutes = appStartTime.getUTCMinutes();
    // console.log('appStartHour', appStartHour)
    if(worker.id == 69 && application.id == 13) {
        console.log('appStartHour', appStartHour)
    }
    // console.log('appStartMinutes', appStartMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('appStartMinutes', appStartMinutes)
    }

    let appEndHour = appEndTime.getUTCHours() + getCurrentMoscowOffsetHours();
    // appEndHour = appEndHour === 0 ? 24 : appEndHour;
    const appEndMinutes = appEndTime.getUTCMinutes();
    // console.log('appEndHour', appEndHour)
    if(worker.id == 69 && application.id == 13) {
        console.log('appEndHour', appEndHour)
    }
    // console.log('appEndMinutes', appEndMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('appEndMinutes', appEndMinutes)
    }

    function adjustHoursForMidnight(startHour: number, endHour: number) {
        // If start hour is greater than end hour, it means the time range crosses midnight
        if(worker.id == 69 && application.id == 13) {
            console.log('startHour, endHour', startHour, endHour);
        }
        if (startHour > endHour) {
            endHour += 24; // Adjust end hour to correctly represent the next day
        }

        if(worker.id == 69 && application.id == 13) {
            console.log('startHour, endHour', startHour, endHour);
        }
        return { adjustedStartHour: startHour, adjustedEndHour: endHour };
    }

    
    const { adjustedStartHour, adjustedEndHour } = adjustHoursForMidnight(appStartHour, appEndHour);

    appStartHour = adjustedStartHour;
    appEndHour = adjustedEndHour;

    // Check if the application time is within the worker's work hours
    if ((appStartHour < workStartHour || appEndHour > workEndHour) || (appEndHour == workEndHour)) {
        return false;
    } else if (worker.id == 69 && application.id == 13) (
        console.log("BRRRRRRR",appStartHour, workStartHour, appEndHour, workEndHour )
    )

    // Check if the application time overlaps with the worker's lunch break
    let [lunchStartHour, lunchEndHour] = worker.lunchBreak.split('-').map((time: string) => parseInt(time.split(':')[0]));
    // lunchStartHour = lunchStartHour === 0 ? 24 : lunchStartHour;
    // lunchEndHour = lunchEndHour === 0 ? 24 : lunchEndHour;

    const { adjustedStartHour: adjustedStartLunchHour, adjustedEndHour: adjustedEndLunchHour } = adjustHoursForMidnight(lunchStartHour, lunchEndHour);

    lunchStartHour = adjustedStartLunchHour;
    lunchEndHour = adjustedEndLunchHour;

    const [lunchStartMinutes, lunchEndMinutes] = worker.lunchBreak.split('-').map((time: string) => parseInt(time.split(':')[1]));

    if(worker.id == 69 && application.id == 13) {
        console.log('worker.lunchBreak', worker.lunchBreak)
        console.log('lunchStartHour', lunchStartHour)
        console.log('adjustedStartLunchHour', adjustedStartLunchHour)
        console.log('adjustedEndLunchHour', adjustedEndLunchHour)
    }
    // console.log('lunchEndHour', lunchEndHour)
    if(worker.id == 69 && application.id == 13) {
        console.log('lunchEndHour', lunchEndHour)
    }
    // console.log('lunchStartMinutes', lunchStartMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('lunchStartMinutes', lunchStartMinutes)
    }
    // console.log('lunchEndMinutes', lunchEndMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('lunchEndMinutes', lunchEndMinutes)
    }

    const appStartTotalMinutes = appStartHour * 60 + appStartMinutes;
    // console.log('appStartTotalMinutes', appStartTotalMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('appStartTotalMinutes', appStartTotalMinutes)
    }
    const appEndTotalMinutes = appEndHour * 60 + appEndMinutes;
    // console.log('appEndTotalMinutes', appEndTotalMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('appEndTotalMinutes', appEndTotalMinutes)
    }
    const lunchStartTotalMinutes = lunchStartHour * 60 + lunchStartMinutes;
    // console.log('lunchStartTotalMinutes', lunchStartTotalMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('lunchStartTotalMinutes', lunchStartTotalMinutes)
    }
    const lunchEndTotalMinutes = lunchEndHour * 60 + lunchEndMinutes;
    // console.log('lunchEndTotalMinutes', lunchEndTotalMinutes)
    if(worker.id == 69 && application.id == 13) {
        console.log('lunchEndTotalMinutes', lunchEndTotalMinutes)
    }

    if ((appStartTotalMinutes >= lunchStartTotalMinutes && appStartTotalMinutes < lunchEndTotalMinutes) ||
        (appEndTotalMinutes > lunchStartTotalMinutes && appEndTotalMinutes <= lunchEndTotalMinutes) ||
        (appStartTotalMinutes < lunchStartTotalMinutes && appEndTotalMinutes > lunchEndTotalMinutes)) {
        return false;
    }
    

    // Check for existing assignments
    for (const assignment of assignments) {
        if (assignment.employeeId === worker.id) {
            const assignedAppEnd = new Date(assignment.endTime);
            const moscowOffset = getCurrentMoscowOffsetHours();
            assignedAppEnd.setHours(assignedAppEnd.getHours() + moscowOffset);
            const assignedAppEndHours = new Date(assignment.endTime).getHours()
            // console.log('assignment.endTime', assignment.endTime)
            if(worker.id == 69 && application.id == 13) {
                console.log('assignment.endTime', assignment.endTime)
            }
            // console.log('assignedAppEnd', assignedAppEnd)
            if(worker.id == 69 && application.id == 13) {
                console.log('assignedAppEnd', assignedAppEnd)
                assignedAppEnd.setHours(assignedAppEnd.getHours() + 3);
                console.log('assignedAppEnd', assignedAppEnd)
                console.log('assignedAppEndHours', assignedAppEndHours)
            }
            const newAppStart = new Date(application.datetime);
            const newAppStartHours = new Date(application.datetime).getUTCHours();
            // console.log('assignment.endTime', application.datetime)
            if(worker.id == 69 && application.id == 13) {
                console.log('assignment.endTime', application.datetime)
            }
            // console.log('newAppStart', newAppStart)
            if(worker.id == 69 && application.id == 13) {
                console.log('newAppStart', newAppStart)
                console.log('newAppStartHours', newAppStartHours)
            }
            if (newAppStart < assignedAppEnd) {
                if(worker.id == 69 && application.id == 13) {
                    console.log('newAppStart AND assignedAppEnd', newAppStart, assignedAppEnd)
                }
                return false;
            } 
            if (newAppStart > assignedAppEnd) {
                if(worker.id == 69 && application.id == 13) {
                    // console.log('newAppStart AND assignedAppEnd', newAppStart, assignedAppEnd)
                }
            } 
        }
    }

    // console.log("COMMUTE TIME CHECK");
    const lastAssignedApplication = assignments
        .filter((a: any) => a.employeeId === worker.id)
        .sort((a: any, b: any) =>  new Date(b.endTime).getTime() - new Date(a.endTime).getTime())[0];

    if (lastAssignedApplication) {
        // console.log("lastAssignedApplication", lastAssignedApplication);
        // console.log('lastAssignedApplication.applicationId', lastAssignedApplication.applicationId)
        const lastApp = await getAppById(lastAssignedApplication.applicationId);
        if (!lastApp) {
            return false;
          }
        // console.log("lastApp", lastApp);
        const lastStation = await getStationById(lastApp?.station2Id);
        if (!lastStation) {
            return false;
          }
        // console.log("lastStation", lastStation);
        const nextStation = await getStationById(application.station1Id);
        // console.log("nextStation", nextStation);
        if (!nextStation) {
            return false;
          }

        const travelInfo = await findAndDecodePath(`${lastStation.id}_${lastStation.lineId}`, `${nextStation.id}_${nextStation.lineId}`);
        // console.log('${lastStation.id}_${lastStation.lineId}`, `${nextStation.id}_${nextStation.lineId}', travelInfo)
        const travelTime = travelInfo.shortestPath * 60000; // Convert to milliseconds
        // console.log("travelTime", travelTime);
        const newAppStart = new Date(new Date(lastAssignedApplication.endTime).getTime() + travelTime);
        // console.log('newAppStart', newAppStart)

        if (newAppStart >= appStartTime) {
            return false;
        }
    }

    if(worker.id == 69 && application.id == 13) {
        console.log('true')
    }
    return true;
};

// Function to determine which group is working on a given date
const getWorkingGroup = (currentDate: Date): number => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1).getTime(); // First day of the year in milliseconds
    const dayDifference = Math.floor((currentDate.getTime() - startOfYear) / (1000 * 60 * 60 * 24)); // Difference in days
    const cycleDay = dayDifference % 4; // 4-day cycle
  
    return cycleDay < 2 ? 1 : 2; // Group 1 works on days 0, 1; Group 2 works on days 2, 3
};

const assignApplicationsToWorkers = async () => {
    const moscowTomorrow = getTomorrowInMoscow();
    const applications = await fetchAndSortApplicationsForDay(moscowTomorrow);
    const workers = await fetchWorkers();
    const workingGroup = getWorkingGroup(moscowTomorrow);
    const groupShiftTypes = workingGroup === 1 ? ['1', '1Н'] : ['2', '2Н'];

    // Filter workers based on shift type and availability
    const availableWorkers = workers.filter(worker => groupShiftTypes.includes(worker.shift));

    // console.log(availableWorkers)

  let schedule: { employeeId: number; applicationId: number }[] = [];
  let assignments: Assignment[] = [];

  for (const app of applications) {
    let assignedWorkers = 0;

    for (const worker of availableWorkers) {
      if (await isWorkerAvailable(worker, app, assignments) && assignedWorkers < app.maleStaffCount + app.femaleStaffCount) {
        schedule.push({ employeeId: worker.id, applicationId: app.id });
        assignments.push({
          employeeId: worker.id,
          applicationId: app.id,
          startTime: app.datetime,
          endTime: new Date(new Date(app.datetime).getTime() + app.pathTime * 60000).toISOString(),
        });
        assignedWorkers++;
      }
    }

    if (assignedWorkers < app.maleStaffCount + app.femaleStaffCount) {
    //   console.log(`Not enough workers for Application ID: ${app.id}`);
    }
  }

  return { schedule, assignments };
};

const getRandomWorkerApplications = (assignments: Assignment[]) => {
  if (assignments.length === 0) {
    console.log('No assignments to display.');
    return;
  }

  const randomAssignment = assignments[Math.floor(Math.random() * assignments.length)];
  const randomemployeeId = randomAssignment.employeeId;
//   const randomemployeeId = 69;
  const workerApplications = assignments.filter(assignment => assignment.employeeId === randomemployeeId);

  console.log(`Applications for Worker ID ${randomemployeeId}:`);
  workerApplications.forEach(assignment => {
    console.log(`Application ID: ${assignment.applicationId}, Start Time: ${assignment.startTime}, End Time: ${assignment.endTime}`);
  });
};

const saveAssignmentsToDatabase = async (assignments: Assignment[]) => {
    const createAssignments = assignments.map(assignment => {
      return prisma.applicationAssignment.create({
        data: {
          applicationId: assignment.applicationId,
          employeeId: assignment.employeeId,
          startTime:  assignment.startTime,
          endTime:  assignment.endTime,
        },
      });
    });
  
    await prisma.$transaction(createAssignments);
  };

  // Function to delete existing assignments for the specified day
const deleteAssignmentsForDay = async (day: Date) => {
    const startOfDay = getStartOfDayInMoscow(day);
    const endOfDay = getEndOfDayInMoscow(day);
  
    await prisma.applicationAssignment.deleteMany({});
    
    // await prisma.applicationAssignment.deleteMany({
    //   where: {
    //     startTime: {
    //         gte: startOfDay.toISOString(),
    //         lt: endOfDay.toISOString(),
    //       },
    //   },
    // });
  };
  
export async function GET(request: NextRequest) {
  try {
    const { schedule, assignments } = await assignApplicationsToWorkers();
    console.log('Generated Schedule:', schedule);
    if(assignments) {
        const moscowTomorrow = getTomorrowInMoscow();
        await deleteAssignmentsForDay(moscowTomorrow);
    }
    await saveAssignmentsToDatabase(assignments);
    getRandomWorkerApplications(assignments);
    return NextResponse.json({ message: 'Schedule generated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json({ message: 'Error generating schedule', error: (error as Error).message }, { status: 500 });
  }
}