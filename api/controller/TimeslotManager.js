class TimeSlotManager {
    splitAvailability(availability, duration) {
        const result = [];
        let currentStartTime = new Date(availability.startDate);

        while (currentStartTime < new Date(availability.endDate)) {
            const currentEndTime = new Date(currentStartTime.getTime() + duration * 60000);
            const currentAvailability = {
                startDate: currentStartTime,
                endDate: currentEndTime,
                specialistID: availability.specialistID,
                businessID: availability.businessID,
                branchID: availability.branchID,
            };

            result.push(currentAvailability);
            currentStartTime = currentEndTime;
        }

        return result;
    }

    async getTimeslots(duration, availabilities) {
        const timeslots = [];

        availabilities.forEach((availability) => {
            const splittedAvailabilities = this.splitAvailability(availability, duration);
            timeslots.push(...splittedAvailabilities);
        });

        return timeslots;
    }

    async bookTimeslot(startTime, endTime, availabilities) {
        for (const availability of availabilities) {
            if (startTime >= new Date(availability.startDate) && endTime <= new Date(availability.endDate)) {
                const changedAvailabilities = [];

                // Case 1: If timeslot takes time in the beginning of availability
                if (startTime.getTime() === new Date(availability.startDate).getTime()) {
                    const secondPartAvailability = {
                        startDate: endTime,
                        endDate: availability.endDate,
                        specialistID: availability.specialistID,
                        businessID: availability.businessID,
                        branchID: availability.branchID,
                    };
                    changedAvailabilities.push(secondPartAvailability);
                } else
                    // Case 2: If timeslot takes time in the end of availability
                if (endTime.getTime() === new Date(availability.endDate).getTime()) {
                    const firstPartAvailability = {
                        startDate: availability.startDate,
                        endDate: startTime,
                        specialistID: availability.specialistID,
                        businessID: availability.businessID,
                        branchID: availability.branchID,
                    };
                    changedAvailabilities.push(firstPartAvailability);
                } else {
                    // Case 3: If timeslot takes time in the middle of availability
                    const firstPartAvailability = {
                        startDate: availability.startDate,
                        endDate: startTime,
                        specialistID: availability.specialistID,
                        businessID: availability.businessID,
                        branchID: availability.branchID,
                    };

                    const secondPartAvailability = {
                        startDate: endTime,
                        endDate: availability.endDate,
                        specialistID: availability.specialistID,
                        businessID: availability.businessID,
                        branchID: availability.branchID,
                    };

                    changedAvailabilities.push(firstPartAvailability);
                    changedAvailabilities.push(secondPartAvailability);
                }

                return changedAvailabilities;
            }
        }

        return null; // No matching availability found for the given timeslot
    }
}

module.exports = TimeSlotManager;