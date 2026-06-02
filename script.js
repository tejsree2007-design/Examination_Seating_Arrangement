let totalStudents = 0;

/* CSV FILE READER */

const csvInput =
    document.getElementById(
        "csvFile"
    );

csvInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload =
            function (e) {

                const text =
                    e.target.result;

                const rows =
                    text.trim().split("\n");

                totalStudents =
                    rows.length - 1;

                const requiredHalls =
                    Math.ceil(
                        totalStudents / 36
                    );

                document.getElementById(
                    "studentInfo"
                ).innerHTML = `

                    <h3>
                        File Details
                    </h3>

                    <p>
                        Total Students:
                        <b>${totalStudents}</b>
                    </p>

                    <p>
                        Required Halls:
                        <b>${requiredHalls}</b>
                    </p>

                `;
            };

        reader.readAsText(file);
    }
);

/* GENERATE BUTTON */

const generateBtn =
    document.getElementById(
        "generateBtn"
    );

generateBtn.addEventListener(
    "click",
    async () => {

        const csvFile =
            document.getElementById(
                "csvFile"
            ).files[0];

        const selectedHalls =
            Array.from(
                document.querySelectorAll(
                    "input[type='checkbox']:checked"
                )
            );

        /* VALIDATIONS */

        if (!csvFile) {

            alert(
                "Please upload CSV file"
            );

            return;
        }

        if (
            selectedHalls.length === 0
        ) {

            alert(
                "Please select halls"
            );

            return;
        }

        const requiredHalls =
            Math.ceil(
                totalStudents / 36
            );

        if (
            selectedHalls.length <
            requiredHalls
        ) {

            alert(
                `Select at least ${requiredHalls} halls`
            );

            return;
        }

        const hallNames =
            selectedHalls.map(
                hall => hall.value
            );

        /* SEND DATA */

        const formData =
            new FormData();

        formData.append(
            "file",
            csvFile
        );

        formData.append(
            "halls",
            JSON.stringify(
                hallNames
            )
        );

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/generate-seating",
                    {
                        method: "POST",
                        body: formData
                    }
                );

            const data =
                await response.json();

            if (data.error) {

                alert(data.error);

                return;
            }

            displaySummary(
                data.total_students,
                data.hallData
            );

            createHallButtons(
                data.hallData
            );

        } catch (error) {

            console.log(error);

            alert(
                "Backend connection failed"
            );
        }
    }
);

/* SUMMARY */

function displaySummary(
    totalStudents,
    hallData
) {

    document.getElementById(
        "summary"
    ).innerHTML = `

        <h2>
            Allocation Summary
        </h2>

        <p>
            Total Students:
            <b>${totalStudents}</b>
        </p>

        <p>
            Used Halls:
            <b>${hallData.length}</b>
        </p>

    `;
}

/* HALL BUTTONS */

function createHallButtons(
    hallData
) {

    const hallButtons =
        document.getElementById(
            "hallButtons"
        );

    hallButtons.innerHTML = "";

    hallData.forEach(hall => {

        const button =
            document.createElement(
                "button"
            );

        button.innerText =
            hall.hallName;

        button.classList.add(
            "hall-btn"
        );

        button.onclick = () => {

            renderHall(hall);
        };

        hallButtons.appendChild(
            button
        );
    });

    /* AUTO OPEN FIRST HALL */

    if (hallData.length > 0) {

        renderHall(
            hallData[0]
        );
    }
}

/* RENDER HALL */

function renderHall(hall) {

    const arrangement =
        document.getElementById(
            "hallArrangement"
        );

    arrangement.innerHTML = `

        <h2 class="hall-title">
            ${hall.hallName} Arrangement
        </h2>

    `;

    const examHall =
        document.createElement(
            "div"
        );

    examHall.classList.add(
        "exam-hall"
    );

    const leftBlock =
        document.createElement(
            "div"
        );

    leftBlock.classList.add(
        "block"
    );

    const rightBlock =
        document.createElement(
            "div"
        );

    rightBlock.classList.add(
        "block"
    );

    let currentIndex = 0;

    for (let row = 0; row < 6; row++) {

        /* LEFT ROW */

        const leftRow =
            document.createElement(
                "div"
            );

        leftRow.classList.add(
            "row"
        );

        for (let i = 0; i < 3; i++) {

            if (
                currentIndex <
                hall.students.length
            ) {

                leftRow.appendChild(
                    createSeat(
                        hall.students[
                            currentIndex
                        ]
                            .hall_ticket
                    )
                );

                currentIndex++;

            } else {

                leftRow.appendChild(
                    createEmptySeat()
                );
            }

            leftRow.appendChild(
                createEmptySeat()
            );
        }

        leftBlock.appendChild(
            leftRow
        );

        /* RIGHT ROW */

        const rightRow =
            document.createElement(
                "div"
            );

        rightRow.classList.add(
            "row"
        );

        for (let i = 0; i < 3; i++) {

            rightRow.appendChild(
                createEmptySeat()
            );

            if (
                currentIndex <
                hall.students.length
            ) {

                rightRow.appendChild(
                    createSeat(
                        hall.students[
                            currentIndex
                        ]
                            .hall_ticket
                    )
                );

                currentIndex++;

            } else {

                rightRow.appendChild(
                    createEmptySeat()
                );
            }
        }

        rightBlock.appendChild(
            rightRow
        );
    }

    examHall.appendChild(
        leftBlock
    );

    examHall.appendChild(
        rightBlock
    );

    arrangement.appendChild(
        examHall
    );
}

/* CREATE FILLED SEAT */

function createSeat(text) {

    const seat =
        document.createElement(
            "div"
        );

    seat.classList.add(
        "seat"
    );

    seat.innerText = text;

    return seat;
}

/* CREATE EMPTY SEAT */

function createEmptySeat() {

    const seat =
        document.createElement(
            "div"
        );

    seat.classList.add(
        "seat",
        "empty"
    );

    seat.innerText = "EMPTY";

    return seat;
}

/* DOWNLOAD PDF */

const downloadBtn =
    document.getElementById(
        "downloadPdfBtn"
    );

downloadBtn.addEventListener(
    "click",
    () => {

        const hallArrangement =
            document.getElementById(
                "hallArrangement"
            );

        if (
            hallArrangement.innerHTML.trim() === ""
        ) {

            alert(
                "Generate seating first"
            );

            return;
        }

        window.print();
    }
);