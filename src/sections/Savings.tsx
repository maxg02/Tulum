import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CustomGauge from "../components/CustomGauge";

export default function Savings() {
    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Savings" />
            <SectionContent>
                <Header currentSection="Savings" />
                <div className="flex-1 flex overflow-hidden">
                    <div className="infoContainer1 w-72">
                        <p>Goals Progress</p>
                        <div className="flex-1 w-full flex flex-col gap-y-4 justify-between">
                            <FontAwesomeIcon icon={faChevronUp} />
                            <div className="flex-1 w-full flex flex-col items-center bg-yellow-200">
                                <div className="flex-1 w-full mb-1">
                                    <CustomGauge value={25} label="25%" />
                                </div>
                                <p>Car</p>
                            </div>
                            <div className="min-h-min w-full flex flex-col items-center bg-green-300">
                                <div className="flex-1 w-full mb-1">
                                    <CustomGauge value={25} label="25%" />
                                </div>
                                <p>Car</p>
                            </div>
                            <div className="min-h-min w-full flex flex-col items-center bg-blue-300">
                                <div className="flex-1 w-full mb-1">
                                    <CustomGauge value={25} label="25%" />
                                </div>
                                <p>Car</p>
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex flex-1">
                            <div className="flex flex-col justify-between">
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                    <p>January Budget</p>
                                    <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                                </div>
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                    <p>2024 Budget</p>
                                    <h1 className="font-light text-5xl my-auto">RD$750K</h1>
                                </div>
                            </div>
                            <div className="infoContainer2 flex-1"></div>
                        </div>
                        <div className="infoContainer2 flex-1"></div>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
