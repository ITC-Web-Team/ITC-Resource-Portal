import Navbar from "../components/Navbar";
import { useState } from "react"
import * as Slider from '@radix-ui/react-slider';

export default function CreateProjectPage() {
    const [budget, setBudget] = useState(15000);
    const contact = "relative flex items-center max-w-xl bg-box-light rounded-lg h-12 pl-3"
    const contact_text = "absolute inset-0 flex-1 bg-transparent text-white2 text-sm h-full rounded-lg w-full pl-40 pr-3"
    return (
        <div className="min-h-screen ">
            <Navbar />

            <main>
                <div className="mx-auto max-w-3xl text-center mt-10">
                    <h1 className="text-4xl text-orange font-bold text-center mt-[65px] leading-[1.5]">
                        Share your idea
                    </h1>
                    <p className="text-m text-text-grey text-left">
                        Shape your idea into a clear plan—define the problem, map the execution, and show what it will take to bring it to life.
                    </p>
                </div>
                <div className="flex flex-col gap-7 mx-auto max-w-3xl mt-10 rounded-4xl bg-box-dark p-10 text-inter text-white1">

                    <div className="flex flex-col space-y-4">
                        <label className="block font-bold text-lg">
                            Project Title <span className="text-orange">*</span>
                        </label>
                        <input type="text" className="w-full bg-box-light rounded-lg h-10 p-3 text-s" />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <label className="block font-bold text-lg">
                            Problem Statement <span className="text-orange">*</span>
                        </label>
                        <textarea rows={3} className="w-full bg-box-light rounded-lg p-3 h-18 resize-none" />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <label className="block font-bold text-lg">
                            Domain / Field <span className="text-orange">*</span>
                        </label>
                        <textarea rows={3} placeholder="AI / ML, Robotics, Software, Electronics, Sustainability etc." className="w-full p-3 bg-box-light rounded-lg h-18 resize-none" />
                    </div>
                    <div className="flex flex-row space-x-20">
                        <div className="flex flex-col space-y-4">
                            <label className="font-bold text-lg">
                                Timeline
                            </label>
                            <select defaultValue="3" className="bg-box-light text-white1 rounded-lg w-30 h-10 pl-1 text-s">
                                <option value="1">1 month</option>
                                <option value="2">2 months</option>
                                <option value="3">3 months</option>
                                <option value="6">6 months</option>
                                <option value="12">1 year</option>
                            </select>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label className="font-bold text-lg">
                                Team Size
                            </label>
                            <select className="bg-box-light text-white1 rounded-lg w-15 h-10 pl-1 text-s">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">5+</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 ">
                        <label className="block font-bold text-lg text-white1">
                            Budget
                        </label>
                        <div className="border border-orange rounded-lg mt-3 mb-3 p-3">
                            <p className="text-orange font-bold text-2xl text-center">
                                ₹{budget.toLocaleString('en-IN')}
                            </p>
                            <p className="text-text-grey text-center text-md font-bold">
                                Drag to adjust • max ₹50,000
                            </p>
                        </div>

                        <div className="mt-5 pl-10 pr-10">
                            <Slider.Root value={[budget]} max={50000} min={0} step={1000} className="relative flex w-full h-2 items-center"
                                onValueChange={(value) => setBudget(value[0])}>
                                <Slider.Track className="relative bg-white1 h-1 w-full rounded-full">
                                    <Slider.Range className="absolute bg-orange rounded-full h-1.5 " />
                                </Slider.Track>
                                <Slider.Thumb className="block w-5 h-5 rounded-full bg-orange outline-none cursor-pointer" />
                            </Slider.Root>
                        </div>
                        <div className=" text-md mt-2">
                            <p className="text-text-grey font-bold">Budget breakdown</p>
                            <textarea className="w-full bg-box-light rounded-lg h-30 text-s mt-4 p-3 resize-none" />
                        </div>
                    </div>
                    <div className="flexflex-col space-y-4">
                        <label className="block font-bold text-lg mt-4 mb-7">
                            Contact
                        </label>
                        <div className={contact}>
                            <span className=" font-bold mr-2 z-10 pointer-events-none">Email</span>
                            <input type="email" className={contact_text} />
                        </div>
                        <div className={contact}>
                            <span className="font-bold mr-2 z-10 pointer-events-none">Contact number</span>
                            <input type="tel" className={contact_text} />
                        </div>
                        <div className={contact}>
                            <span className="font-bold mr-2 z-10 pointer-events-none">Team lead name</span>
                            <input type="text" className={contact_text} />
                        </div>


                    </div>
                </div>
                <div className="flex items-center justify-end gap-7 max-w-3xl mx-auto mt-10 mb-20">
                    <button type="button" className="group relative overflow-hidden border border-orange font-semibold rounded-lg px-6 py-3 cursor-pointer active:scale-95 transition:transform duration-200">
                        <span className="absolute inset-0 bg-orange scale-x-0 origin-left transition-all duration-200 group-hover:scale-x-100" />
                        <span className="relative z-10 transition-colors">
                            Cancel
                        </span>
                    </button>
                    <button type="submit" className="group relative overflow-hidden font-semibold rounded-lg px-6 py-3 cursor-pointer active:scale-95 transition:transform duration-200">
                        <span className="absolute inset-0 bg-orange" />
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-light to-orange scale-x-0 origin-left transition-all duration-400 group-hover:scale-x-100" />
                        <span className="relative z-10">
                            Submit for review &rarr;
                        </span>
                    </button>
                </div>
            </main>
        </div>
    )

}