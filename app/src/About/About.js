import React, { Component } from "react";

// Profile pics
import Lucas from "../assets/lucas.jpg";
import Johannes from "../assets/johannes.jpg";
import Filippa from "../assets/filippa.jpg";
import Evelina from "../assets/evelina.jpg";
import Axel from "../assets/axel.jpg";
import Ibrahim from "../assets/ibrahim.jpg";

// Labtrino logo
import Labtrino from "../assets/logo_labtrino.png";

export default class About extends Component {
	render() {
		return (
			<div
				className="modal fade"
				id="aboutModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="aboutModal"
				aria-hidden="true"
			>
				<div
					className="modal-dialog modal-dialog-centered modal-lg"
					role="document"
				>
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title" id="exampleModalLongTitle">
								About
							</h4>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="container">
								<p className="text-left pt-2">
									This is a group project in the course DH2321 Infomation
									Visualization from the Royal Institute of Technology (KTH) in
									Stockholm, Sweden. The project is a collaboration with startup company <a href="http://www.labtrino.com/">Labrino AB</a>, 
                                    a company which develops intelligent water meter systems for residental property owners. 
                                    This web application is supposed to help property managers in their daily work by providing them a set of visualizations to gain insights about water consumption.
                                    <img src={Labtrino} alt="Labtrino Logo" className="img-fluid col-lg-4 col-6 p-4 mx-auto d-block" />
								</p>
								<h3 className="pb-2">Meet our Team</h3>
								<p className="text-left">
									We are 6 students from a variety of
									master programs, within the fields of Visualization,
									Interaction Design, Computer Science and Machine Learning.
								</p>
								<div className="row p-2 rounded">
									<div className="row mx-auto justify-content-center">
										<div className="col-md-4 col-10 p-2">
											<div className="col-12">
												<img
													className="rounded mx-auto d-block img-fluid"
													src={Lucas}
													alt="Lucas"
												/>
											</div>
											<div className="col-12">
												<p className="text-muted m-0 mt-2">Lucas Ahlgren</p>
												<a href="mailto:lucasah@kth.se">lucasah@kth.se</a>
											</div>
										</div>

										<div className="col-md-4 col-10 p-2">
											<div className="col-12">
												<img
													className="rounded mx-auto d-block img-fluid"
													src={Johannes}
													alt="Johannes"
												/>
											</div>
											<div className="col-12">
												<p className="text-muted m-0 mt-2">Johannes Karlsson</p>
												<a href="mailto:jkar5@kth.se">jkar5@kth.se</a>
											</div>
										</div>

										<div className="col-md-4 col-10 p-2">
											<div className="col-12">
												<img
													className="rounded mx-auto d-block img-fluid"
													src={Filippa}
													alt="Filippa"
												/>
											</div>
											<div className="col-12">
												<p className="text-muted m-0 mt-2">Filippa Bång</p>
												<a href="mailto:fban@kth.se">fban@kth.se</a>
											</div>
										</div>

										<div className="col-md-4 col-10 p-2">
											<div className="col-12">
												<img
													className="rounded mx-auto d-block img-fluid"
													src={Evelina}
													alt="Evelina"
												/>
											</div>
											<div className="col-12">
												<p className="text-muted m-0 mt-2">Evelina Hedberg</p>
												<a href="mailto:evehed@kth.se">evehed@kth.se</a>
											</div>
										</div>

										<div className="col-md-4 col-10 p-2">
											<div className="col-12">
												<img
													className="rounded mx-auto d-block img-fluid"
													src={Ibrahim}
													alt="Ibrahim"
												/>
											</div>
											<div className="col-12">
												<p className="text-muted m-0 mt-2">Ibrahim Asfadai</p>
												<a href="mailto:asfadai@kth.se">asfadai@kth.se</a>
											</div>
										</div>

										<div className="col-md-4 col-10 p-2">
											<div className="col-12">
												<img
													className="rounded mx-auto d-block img-fluid"
													src={Axel}
													alt="Axel"
												/>
											</div>
											<div className="col-12">
												<p className="text-muted m-0 mt-2">Axel Karlsson</p>
												<a href="mailto:axelkarl@kth.se">axelkarl@kth.se</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
