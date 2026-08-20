import React from "react";

interface TourDetailsProps {
  tourName?: string;
  location?: string;
}

const TourDetails: React.FC<TourDetailsProps> = ({
  tourName = "Tour Details",
  location = "India",
}) => {
  return (
<>
  {/* tp-tour-details-area-start */}
  <div className="tp-tour-details-area pt-10">
    <div className="container container-1350">
      <div className="row gx-25">
        <div className="col-12">
          <div className="tp-tour-details">
            <h2 className="tp-breadcrumb-title text-black mb-15">
              {tourName}
            </h2>
            <div className="tp-tour-details-meta mb-15">
              <span>
                <a href="#">English</a>
                <a href="#">Chinese</a>
                <a href="#">Japanese</a>
                <a href="#">Korean</a>
              </span>
              <span>
                <a href="#">Meet with guide</a>
              </span>
              <span>6 to 8 Hours</span>
            </div>
            <div className="tp-tour-details-price-wrap mb-35 d-flex align-items-center flex-wrap gap-2 justify-content-between">
              <div className="d-flex align-items-center flex-wrap mb-10">
                <div className="tp-tour-info">
                  <span>
                    <svg
                      width={15}
                      height={16}
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.49961 7.04985C9.49961 8.40295 8.40271 9.49985 7.04961 9.49985C5.69651 9.49985 4.59961 8.40295 4.59961 7.04985C4.59961 5.69675 5.69651 4.59985 7.04961 4.59985C8.40271 4.59985 9.49961 5.69675 9.49961 7.04985Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7.04951 0.75C10.4587 0.75 13.349 3.57287 13.349 6.99757C13.349 10.4768 10.4116 12.9183 7.69836 14.5786C7.50063 14.6903 7.27699 14.7489 7.04951 14.7489C6.82203 14.7489 6.5984 14.6903 6.40066 14.5786C3.6925 12.9022 0.75 10.4888 0.75 6.99757C0.75 3.57287 3.64038 0.75 7.04951 0.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {location}
                  </span>
                </div>
                <div className="tp-tour-review-meta d-flex align-items-center">
                  <div className="tp-tour-review">
                    <span>
                      <svg
                        width={17}
                        height={16}
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.4122 0L11.0116 5.26604L16.8244 6.11567L12.6183 10.2124L13.6109 16L8.4122 13.266L3.21346 16L4.2061 10.2124L0 6.11567L5.81283 5.26604L8.4122 0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span>
                      <svg
                        width={17}
                        height={16}
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.4122 0L11.0116 5.26604L16.8244 6.11567L12.6183 10.2124L13.6109 16L8.4122 13.266L3.21346 16L4.2061 10.2124L0 6.11567L5.81283 5.26604L8.4122 0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span>
                      <svg
                        width={17}
                        height={16}
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.4122 0L11.0116 5.26604L16.8244 6.11567L12.6183 10.2124L13.6109 16L8.4122 13.266L3.21346 16L4.2061 10.2124L0 6.11567L5.81283 5.26604L8.4122 0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span>
                      <svg
                        width={17}
                        height={16}
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.4122 0L11.0116 5.26604L16.8244 6.11567L12.6183 10.2124L13.6109 16L8.4122 13.266L3.21346 16L4.2061 10.2124L0 6.11567L5.81283 5.26604L8.4122 0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span>
                      <svg
                        width={17}
                        height={16}
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.4122 0L11.0116 5.26604L16.8244 6.11567L12.6183 10.2124L13.6109 16L8.4122 13.266L3.21346 16L4.2061 10.2124L0 6.11567L5.81283 5.26604L8.4122 0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="tp-tour-review-score tp-ff-inter">
                    ( 05 Reviews )
                  </span>
                </div>
              </div>
              <div className="tp-tour-details-wishlist d-flex align-items-center mb-10">
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop2"
                >
                  <svg
                    width={20}
                    height={22}
                    viewBox="0 0 20 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 6.75C17.4069 6.75 18.75 5.40685 18.75 3.75C18.75 2.09315 17.4069 0.75 15.75 0.75C14.0931 0.75 12.75 2.09315 12.75 3.75C12.75 5.40685 14.0931 6.75 15.75 6.75Z"
                      stroke="#5C5F66"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.75 13.75C5.40685 13.75 6.75 12.4069 6.75 10.75C6.75 9.09315 5.40685 7.75 3.75 7.75C2.09315 7.75 0.75 9.09315 0.75 10.75C0.75 12.4069 2.09315 13.75 3.75 13.75Z"
                      stroke="#5C5F66"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.75 20.75C17.4069 20.75 18.75 19.4069 18.75 17.75C18.75 16.0931 17.4069 14.75 15.75 14.75C14.0931 14.75 12.75 16.0931 12.75 17.75C12.75 19.4069 14.0931 20.75 15.75 20.75Z"
                      stroke="#5C5F66"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.33984 12.26L13.1698 16.24"
                      stroke="#5C5F66"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1598 5.26001L6.33984 9.24001"
                      stroke="#5C5F66"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Share
                </button>
                <a href="#">
                  <svg
                    width={20}
                    height={18}
                    viewBox="0 0 20 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.362 2.16452C16.9222 1.71607 16.4 1.36034 15.8252 1.11763C15.2505 0.874922 14.6344 0.75 14.0123 0.75C13.3901 0.75 12.7741 0.874922 12.1993 1.11763C11.6246 1.36034 11.1024 1.71607 10.6626 2.16452L9.74977 3.09476L8.83699 2.16452C7.94858 1.25912 6.74364 0.750469 5.48725 0.750469C4.23085 0.750469 3.02591 1.25912 2.13751 2.16452C1.2491 3.06992 0.75 4.2979 0.75 5.57833C0.75 6.85875 1.2491 8.08674 2.13751 8.99214L3.05029 9.92238L9.74977 16.75L16.4492 9.92238L17.362 8.99214C17.8021 8.54391 18.1511 8.01171 18.3893 7.42596C18.6274 6.8402 18.75 6.21237 18.75 5.57833C18.75 4.94428 18.6274 4.31645 18.3893 3.7307C18.1511 3.14494 17.8021 2.61275 17.362 2.16452Z"
                      stroke="#5C5F66"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add To Wishlist
                </a>
              </div>
            </div>
            <div className="tp-tour-details-gallery-wrap tp-tour-details-3-gallery-wrap">
              <div className="row gx-10">
                <div className="col-lg-7 mb-10">
                  <div className="tp-tour-gallery-thumb gallery-col-1 p-relative fix">
                    <a
                      className="popup-video d-block"
                      href="https://www.youtube.com/watch?v=tffjAlDbBGU"
                    >
                      <img
                        className="w-100"
                        src="assets/img/tour/details-3/gallery/thumb.jpg"
                        alt="gallery"
                      />
                    </a>
                    <div className="tp-tour-media-meta">
                      <a
                        className="popup-video"
                        href="https://www.youtube.com/watch?v=tffjAlDbBGU"
                      >
                        <svg
                          width={25}
                          height={20}
                          viewBox="0 0 25 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.5 8.70312C0.5 4.83614 0.5 2.90264 1.71734 1.70132C2.93467 0.5 4.89395 0.5 8.8125 0.5H10C13.9185 0.5 15.8778 0.5 17.0952 1.70132C18.3125 2.90264 18.3125 4.83614 18.3125 8.70312V11.0469C18.3125 14.9138 18.3125 16.8473 17.0952 18.0487C15.8778 19.25 13.9185 19.25 10 19.25H8.8125C4.89395 19.25 2.93467 19.25 1.71734 18.0487C0.5 16.8473 0.5 14.9138 0.5 11.0469V8.70312Z"
                            stroke="currentColor"
                          />
                          <path
                            d="M18.3125 6.24905L18.462 6.1273C20.9745 4.08152 22.2308 3.05863 23.2404 3.55253C24.25 4.04642 24.25 5.68385 24.25 8.95871V10.7913C24.25 14.0662 24.25 15.7036 23.2404 16.1975C22.2308 16.6913 20.9745 15.6685 18.462 13.6227L18.3125 13.5009"
                            stroke="currentColor"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11.7812 8.70312C12.765 8.70312 13.5625 7.91613 13.5625 6.94531C13.5625 5.9745 12.765 5.1875 11.7812 5.1875C10.7975 5.1875 10 5.9745 10 6.94531C10 7.91613 10.7975 8.70312 11.7812 8.70312Z"
                            stroke="currentColor"
                          />
                        </svg>
                      </a>
                      <a href="https://www.google.com/maps" target="_blank">
                        <svg
                          width={23}
                          height={20}
                          viewBox="0 0 23 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.95679 1.74567L2.65218 2.48764C1.60223 3.08476 1.07725 3.38334 0.788618 3.88003C0.5 4.37672 0.5 4.9816 0.5 6.19133V14.6961C0.5 16.2856 0.5 17.0804 0.863651 17.5227C1.10564 17.8171 1.44473 18.0149 1.81963 18.0805C2.38303 18.1791 3.07282 17.7868 4.45236 17.0022C5.38916 16.4694 6.29074 15.916 7.41143 16.0661C7.9212 16.1344 8.40746 16.3715 9.37995 16.8455L13.4322 18.8208C14.3087 19.2481 14.3168 19.25 15.2915 19.25H17.5C19.5035 19.25 20.5052 19.25 21.1276 18.6264C21.75 18.0027 21.75 16.9989 21.75 14.9914V7.97031C21.75 5.96274 21.75 4.95896 21.1276 4.33529C20.5052 3.71163 19.5035 3.71163 17.5 3.71163H15.2915C14.3168 3.71163 14.3087 3.70978 13.4322 3.2825L9.89239 1.55691C8.41439 0.836429 7.6754 0.476189 6.88815 0.501221C6.10089 0.526262 5.38619 0.932731 3.95679 1.74567Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.85938 0.5V15.6042"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.3066 4.146V18.7293"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="tp-tour-gallery-inner">
                    <div className="row gx-10">
                      <div className="col-sm-6 mb-10">
                        <div className="tp-tour-gallery-thumb gallery-col-3 fix">
                          <a
                            className="popup-image"
                            href="assets/img/tour/details-3/gallery/thumb-2.jpg"
                          >
                            <img
                              className="w-100"
                              src="assets/img/tour/details-3/gallery/thumb-2.jpg"
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-10">
                        <div className="tp-tour-gallery-thumb gallery-col-4 gallery fix p-relative">
                          <a
                            className="popup-image"
                            href="assets/img/tour/details-3/gallery/thumb-3.jpg"
                          >
                            <img
                              className="w-100"
                              src="assets/img/tour/details-3/gallery/thumb-3.jpg"
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-10">
                        <div className="tp-tour-gallery-thumb gallery-col-3 fix">
                          <a
                            className="popup-image"
                            href="assets/img/tour/details-3/gallery/thumb-4.jpg"
                          >
                            <img
                              className="w-100"
                              src="assets/img/tour/details-3/gallery/thumb-4.jpg"
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-10">
                        <div className="tp-tour-gallery-thumb gallery-col-4 gallery fix p-relative">
                          <a
                            className="popup-image"
                            href="assets/img/tour/details-3/gallery/thumb-5.jpg"
                          >
                            <img
                              className="w-100"
                              src="assets/img/tour/details-3/gallery/thumb-5.jpg"
                              alt=""
                            />
                          </a>
                          <div className="tp-tour-media-meta">
                            <a
                              className="popup-image"
                              href="assets/img/tour/details-3/gallery/thumb-5.jpg"
                            >
                              <svg
                                width={22}
                                height={22}
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.11628 6.90698C5.11628 7.46352 5.28131 8.00757 5.59052 8.47033C5.89972 8.93308 6.3392 9.29375 6.85338 9.50673C7.36756 9.71971 7.93335 9.77544 8.47921 9.66686C9.02506 9.55828 9.52646 9.29028 9.92 8.89674C10.3135 8.5032 10.5815 8.00181 10.6901 7.45595C10.7987 6.9101 10.743 6.34431 10.53 5.83012C10.317 5.31594 9.95633 4.87646 9.49358 4.56726C9.03083 4.25806 8.48678 4.09302 7.93023 4.09302C7.18409 4.09357 6.46867 4.39021 5.94107 4.91781C5.41346 5.44541 5.11682 6.16084 5.11628 6.90698ZM9.2093 6.90698C9.2093 7.15995 9.13429 7.40725 8.99374 7.61759C8.85319 7.82793 8.65343 7.99187 8.41971 8.08868C8.18599 8.18549 7.92881 8.21082 7.6807 8.16147C7.43258 8.11212 7.20467 7.9903 7.02579 7.81142C6.84691 7.63253 6.72509 7.40463 6.67574 7.15651C6.62639 6.9084 6.65172 6.65122 6.74853 6.4175C6.84534 6.18378 7.00928 5.98401 7.21962 5.84347C7.42996 5.70292 7.67726 5.62791 7.93023 5.62791C8.2693 5.62845 8.59432 5.76338 8.83407 6.00314C9.07383 6.24289 9.20876 6.56791 9.2093 6.90698ZM21.2326 8.18605C21.029 8.18605 20.8338 8.2669 20.6899 8.41083C20.546 8.55475 20.4651 8.74995 20.4651 8.95349V11.2732L20.065 10.9304C19.5184 10.4775 18.8307 10.2296 18.1208 10.2296C17.4109 10.2296 16.7233 10.4775 16.1767 10.9304L11.9209 14.5814C11.6527 14.795 11.3199 14.9113 10.977 14.9113C10.6341 14.9113 10.3013 14.795 10.033 14.5814L9.6933 14.2898C9.18922 13.8725 8.5645 13.6282 7.91112 13.5926C7.25773 13.5571 6.61019 13.7322 6.06381 14.0923L1.84084 16.9267C1.61934 15.991 1.51655 15.0311 1.53488 14.0698V7.93023C1.53488 3.20893 3.20893 1.53488 7.93023 1.53488H12.0233C12.2268 1.53488 12.422 1.45403 12.5659 1.31011C12.7098 1.16618 12.7907 0.97098 12.7907 0.767442C12.7907 0.563904 12.7098 0.368702 12.5659 0.224779C12.422 0.0808553 12.2268 0 12.0233 0H7.93023C2.37191 0 0 2.37088 0 7.93023V14.0698C0 19.6291 2.37191 22 7.93023 22H14.0698C19.6281 22 22 19.6291 22 14.0698V8.95349C22 8.74995 21.9191 8.55475 21.7752 8.41083C21.6313 8.2669 21.4361 8.18605 21.2326 8.18605ZM20.4651 14.0698C20.4651 18.7911 18.7911 20.4651 14.0698 20.4651H7.93023C5.10912 20.4651 3.38288 19.8604 2.44456 18.3726L6.91823 15.3703C7.1865 15.1987 7.50152 15.1148 7.81961 15.1302C8.13771 15.1456 8.44315 15.2595 8.69358 15.4563L9.0333 15.7489C9.57952 16.2028 10.2673 16.4513 10.9775 16.4513C11.6877 16.4513 12.3755 16.2028 12.9217 15.7489L17.1805 12.0949C17.449 11.8822 17.7814 11.7665 18.1239 11.7665C18.4664 11.7665 18.7989 11.8822 19.0674 12.0949L20.4672 13.2962L20.4651 14.0698ZM14.0698 3.83721C14.0698 3.63367 14.1506 3.43847 14.2945 3.29455C14.4385 3.15062 14.6337 3.06977 14.8372 3.06977H16.8837V1.02326C16.8837 0.819718 16.9646 0.624516 17.1085 0.480592C17.2524 0.336669 17.4476 0.255814 17.6512 0.255814C17.8547 0.255814 18.0499 0.336669 18.1938 0.480592C18.3377 0.624516 18.4186 0.819718 18.4186 1.02326V3.06977H20.4651C20.6687 3.06977 20.8639 3.15062 21.0078 3.29455C21.1517 3.43847 21.2326 3.63367 21.2326 3.83721C21.2326 4.04075 21.1517 4.23595 21.0078 4.37987C20.8639 4.5238 20.6687 4.60465 20.4651 4.60465H18.4186V6.65116C18.4186 6.8547 18.3377 7.0499 18.1938 7.19383C18.0499 7.33775 17.8547 7.4186 17.6512 7.4186C17.4476 7.4186 17.2524 7.33775 17.1085 7.19383C16.9646 7.0499 16.8837 6.8547 16.8837 6.65116V4.60465H14.8372C14.6337 4.60465 14.4385 4.5238 14.2945 4.37987C14.1506 4.23595 14.0698 4.04075 14.0698 3.83721Z"
                                  fill="currentColor"
                                />
                              </svg>
                              View All
                            </a>
                            <div className="d-none">
                              <a
                                className=" popup-image"
                                href="assets/img/footer/thumb-5.jpg"
                              >
                                <img
                                  className="w-100"
                                  src="assets/img/tour/details/gallery/thumb-3.jpg"
                                  alt=""
                                />
                              </a>
                              <a
                                className="popup-image"
                                href="assets/img/footer/thumb-3.jpg"
                              >
                                <img
                                  className="w-100"
                                  src="assets/img/tour/details/gallery/thumb.jpg"
                                  alt=""
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tp-tour-details-content-wrap tp-tour-details-3-content-wrap mt-30">
              <div className="row gx-25">
                <div className="col-lg-7">
                  <div className="tp-tour-details-content tp-tour-details-3-content mb-30">
                    <p className="mb-40">
                      Discover the perfect escape with our carefully curated
                      travel packages. Whether you’re seeking adventure,
                      relaxation, or cultural discovery, our tours are designed
                      to offer unforgettable experiences. Explore breath-taking
                      landscapes, meet friendly locals,
                    </p>
                    <h3 className="tp-tour-details-title fw-600 mb-25">
                      About this activity
                    </h3>
                    <div className="tp-tour-details-info tp-tour-details-border pb-45 mb-50">
                      <ul>
                        <li>
                          <span className="tp-tour-details-info-icon">
                            <svg
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.5508 0.550049C17.6259 0.550049 22.5508 5.47492 22.5508 11.55C22.5508 17.6252 17.6259 22.55 11.5508 22.55C5.47565 22.55 0.550781 17.6252 0.550781 11.55M8.15069 1.08561C7.04079 1.44598 6.00827 1.97803 5.08447 2.6504M2.65116 5.0837C1.97865 6.00768 1.44653 7.04041 1.08615 8.15053"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14.8474 14.8507L8.24805 8.25073M8.24875 14.8507L14.8481 8.25073"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div className="tp-tour-details-info-content">
                            <h3 className="fw-600 tp-ff-inter mb-0">
                              Free cancellation
                            </h3>
                            <span>
                              Cancel up to 24 hours in advance for a full refund
                            </span>
                          </div>
                        </li>
                        <li>
                          <span className="tp-tour-details-info-icon">
                            <svg
                              width={23}
                              height={25}
                              viewBox="0 0 23 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.1 0.5V5.3M6.5 0.5V5.3"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M22.1 12.5C22.1 7.97454 22.1 5.7118 20.6941 4.30591C19.2883 2.90002 17.0254 2.90002 12.5 2.90002H10.1C5.57451 2.90002 3.31178 2.90002 1.90588 4.30591C0.5 5.7118 0.5 7.97454 0.5 12.5V14.9C0.5 19.4255 0.5 21.6883 1.90588 23.0941C3.31178 24.5 5.57451 24.5 10.1 24.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M0.5 10.1H22.1"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.8205 20.5413L17.3 19.7V17.6202M22.1 19.7C22.1 22.3509 19.9509 24.5 17.3 24.5C14.6491 24.5 12.5 22.3509 12.5 19.7C12.5 17.0491 14.6491 14.9 17.3 14.9C19.9509 14.9 22.1 17.0491 22.1 19.7Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div className="tp-tour-details-info-content">
                            <h3 className="fw-600 tp-ff-inter mb-0">
                              Reserve now &amp; pay later
                            </h3>
                            <span>
                              Keep your travel plans flexible — book your spot
                              and pay nothing today.
                            </span>
                          </div>
                        </li>
                        <li>
                          <span className="tp-tour-details-info-icon">
                            <svg
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.6055 22.7109C17.7388 22.7109 22.7109 17.7388 22.7109 11.6055C22.7109 5.47209 17.7388 0.5 11.6055 0.5C5.47209 0.5 0.5 5.47209 0.5 11.6055C0.5 17.7388 5.47209 22.7109 11.6055 22.7109Z"
                                stroke="currentColor"
                              />
                              <path
                                d="M8.82812 8.82915L12.7149 12.7156M16.0467 7.16333L10.4939 12.7161"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div className="tp-tour-details-info-content">
                            <h3 className="fw-600 tp-ff-inter mb-0">
                              Duration 3 hours
                            </h3>
                            <span>
                              Check availability to see starting times
                            </span>
                          </div>
                        </li>
                        <li>
                          <span className="tp-tour-details-info-icon">
                            <svg
                              width={24}
                              height={21}
                              viewBox="0 0 24 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.6007 16.8786C14.902 17.3466 13.0702 18.3023 14.1859 19.4981C14.7309 20.0822 15.338 20.5 16.1011 20.5H18.2785H20.4558C21.2189 20.5 21.826 20.0822 22.371 19.4981C23.4867 18.3023 21.6549 17.3466 20.9562 16.8786C19.3179 15.7812 17.239 15.7812 15.6007 16.8786Z"
                                stroke="currentColor"
                              />
                              <path
                                d="M20.5011 11.0556C20.5011 12.2829 19.5062 13.2778 18.2789 13.2778C17.0515 13.2778 16.0566 12.2829 16.0566 11.0556C16.0566 9.82826 17.0515 8.83337 18.2789 8.83337C19.5062 8.83337 20.5011 9.82826 20.5011 11.0556Z"
                                stroke="currentColor"
                              />
                              <path
                                d="M9.38867 3.83333H14.9442M9.38867 0.5H18.2776"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6.05556 7.72217V12.7222C6.05556 13.7698 6.05556 14.2935 5.73012 14.619C5.40468 14.9444 4.8809 14.9444 3.83333 14.9444H2.72222C1.67466 14.9444 1.15088 14.9444 0.825433 14.619C0.5 14.2935 0.5 13.7698 0.5 12.7222V9.94444C0.5 8.89688 0.5 8.3731 0.825433 8.0476C1.15088 7.72217 1.67466 7.72217 2.72222 7.72217H6.05556ZM6.05556 7.72217H11.6111"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.50109 2.72222C5.50109 3.94952 4.50616 4.94445 3.27886 4.94445C2.05156 4.94445 1.05664 3.94952 1.05664 2.72222C1.05664 1.49492 2.05156 0.5 3.27886 0.5C4.50616 0.5 5.50109 1.49492 5.50109 2.72222Z"
                                stroke="currentColor"
                              />
                            </svg>
                          </span>
                          <div className="tp-tour-details-info-content">
                            <h3 className="fw-600 tp-ff-inter mb-0">
                              Instructor
                            </h3>
                          </div>
                        </li>
                        <li>
                          <span className="tp-tour-details-info-icon">
                            <svg
                              width={21}
                              height={19}
                              viewBox="0 0 21 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5 13.5C10.5 16.2614 8.26142 18.5 5.5 18.5C2.73858 18.5 0.5 16.2614 0.5 13.5C0.5 10.7386 2.73858 8.5 5.5 8.5C8.26142 8.5 10.5 10.7386 10.5 13.5Z"
                                stroke="currentColor"
                              />
                              <path
                                d="M16.5 17C16.5 17.8284 15.8284 18.5 15 18.5C14.1716 18.5 13.5 17.8284 13.5 17C13.5 16.1716 14.1716 15.5 15 15.5C15.8284 15.5 16.5 16.1716 16.5 17Z"
                                stroke="currentColor"
                              />
                              <path
                                d="M5.50704 13.5H5.49805"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M4.5 8.5L3.8721 3.47683C3.7273 2.31842 3.6549 1.73921 3.35048 1.32169C3.17889 1.08637 2.95799 0.89136 2.7032 0.75029C2.25115 0.5 1.66743 0.5 0.5 0.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                              />
                              <path
                                d="M4.5 4.5H10C12.357 4.5 13.5355 4.5 14.2678 5.23223C15 5.96447 15 7.14298 15 9.5V15.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                              />
                              <path
                                d="M10.5 11.5H14.5241C15.409 11.5 15.8515 11.5 16.2374 11.6887C16.3297 11.7339 16.4188 11.7867 16.5039 11.8468C16.8597 12.0978 17.1052 12.5057 17.596 13.3214C17.989 13.9745 18.1855 14.3011 18.4799 14.4279C18.5491 14.4578 18.6212 14.4789 18.6947 14.4911C19.0071 14.5428 19.3239 14.3673 19.9576 14.0163L20.5 13.7158"
                                stroke="currentColor"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div className="tp-tour-details-info-content">
                            <h3 className="fw-600 tp-ff-inter mb-0">
                              Wheelchair accessible
                            </h3>
                          </div>
                        </li>
                        <li>
                          <span className="tp-tour-details-info-icon">
                            <svg
                              width={22}
                              height={22}
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7636 6.02632C13.7636 2.97422 11.2893 0.5 8.23725 0.5C5.18516 0.5 2.71094 2.97422 2.71094 6.02632C2.71094 9.07839 5.18516 11.5526 8.23725 11.5526C11.2893 11.5526 13.7636 9.07839 13.7636 6.02632Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M0.5 19.2895C0.5 15.0165 3.96391 11.5526 8.23684 11.5526C9.42345 11.5526 10.5476 11.8198 11.5526 12.2971"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M21.5005 16.5263V13.7631C19.29 13.7631 17.6321 12.6578 17.6321 12.6578C17.6321 12.6578 15.9742 13.7631 13.7637 13.7631V16.5263C13.7637 20.3947 17.6321 21.4999 17.6321 21.4999C17.6321 21.4999 21.5005 20.3947 21.5005 16.5263Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div className="tp-tour-details-info-content">
                            <h3 className="fw-600 tp-ff-inter mb-0">
                              Private group
                            </h3>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="tp-tour-activity-details">
                      <div className="tp-tour-activity-item d-flex tp-tour-details-border pb-30 mb-30">
                        <h3 className="tp-tour-details-title fw-600 mb-10">
                          Highlights
                        </h3>
                        <div className="tp-tour-activity-content">
                          <ul>
                            <li>Moments That Last Forever</li>
                            <li>Memories Beyond the Journey</li>
                            <li>Creative and unique art</li>
                          </ul>
                        </div>
                      </div>
                      <div className="tp-tour-activity-item d-flex tp-tour-details-border pb-30 mb-50">
                        <h3 className="tp-tour-details-title fw-600 mb-10">
                          Full description
                        </h3>
                        <div className="tp-tour-activity-content">
                          <p className="mb-0">
                            With 500 grams of clay you make your own art: vase,
                            plate, name tag or some thing else. There will be a
                            focus on specific techniques and our teachers will
                            guide you your creative time.
                          </p>
                        </div>
                      </div>
                      <div className="tp-tour-activity-item d-flex tp-tour-details-border pb-25 mb-50">
                        <h3 className="tp-tour-details-title fw-600 mb-10">
                          Includes
                        </h3>
                        <div className="tp-tour-details-highlight tp-tour-activity-includes">
                          <ul>
                            <li>
                              <svg
                                width={12}
                                height={10}
                                viewBox="0 0 12 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.5 6.63649C0.5 6.63649 1.67857 6.63649 3.25 9.50012C3.25 9.50012 7.61763 2.00012 11.5 0.500122"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Our Cafe in Samsøgade 17, 9000 Aalborg.
                            </li>
                          </ul>
                          <ul className="remove">
                            <li>
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.5 0.5L0.500608 9.4994M9.4994 9.5L0.5 0.500638"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Personal expenses and shopping costs
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tp-tour-activity-item d-flex w-100 tp-tour-details-border pb-30 mb-50">
                        <h3 className="tp-tour-details-title fw-600 mb-10">
                          Meeting point
                        </h3>
                        <div className="tp-tour-activity-content w-100">
                          <p className="mb-25">
                            Our Cafe in Samsøgade 17, 9000 Aalborg.
                          </p>
                          <div className="tp-tour-activity-map">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d29198.421867866567!2d90.3643136!3d23.8256128!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1747064210712!5m2!1sen!2sbd"
                              allowFullScreen={true}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tp-tour-activity-item d-flex">
                        <h3 className="tp-tour-details-title fw-600 mb-10">
                          Important information
                        </h3>
                        <div className="tp-tour-activity-content tp-tour-activity-info">
                          <h3 className="tp-tour-activity-info-title mb-15">
                            Know before you go
                          </h3>
                          <ul>
                            <li>Please carry a valid ID or passport.</li>
                            <li>
                              Arrive at the meeting point 15 minutes early.
                            </li>
                            <li>
                              Comfortable shoes and clothes are recommended.
                            </li>
                            <li>Children must be accompanied by an adult.</li>
                            <li>Bring sunscreen, hat, and water bottle.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="tp-booking-sidebar-wrap tp-booking-3-sidebar-wrap ml-30 mb-30">
                    <div className="tp-booking-sidebar-item mb-40 tp-booking-sidebar-form">
                      <div className="tp-tour-details-price d-flex align-items-end mb-25">
                        <div className="tp-tour-top-price mr-5">
                          <span className="tp-tour-prefix fw-600">From:</span>
                          <span className="tp-tour-old-price fw-500">
                            $21,165
                          </span>
                        </div>
                        <div className="tp-tour-bottom-price">
                          <span className="tp-tour-new-price fw-700">$562</span>
                          <span className="tp-tour-suffix">/ Per Person</span>
                        </div>
                      </div>
                      <div className="tp-booking-form tp-tour-details-border mb-30 pb-30">
                        <form action="#">
                          <div className="tp-booking-wrap p-relative">
                            <div className="tp-booking-location tp-booking-col-3 mb-15 tp-booking-nohide p-relative">
                              <div className="tp-booking-location-input tp-booking-toggle no-border p-relative">
                                <span className="tp-booking-input-icon">
                                  <svg
                                    width={16}
                                    height={18}
                                    viewBox="0 0 16 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M7.78385 9.58333C5.14219 9.58333 2.99219 7.43333 2.99219 4.79167C2.99219 2.15 5.14219 0 7.78385 0C10.4255 0 12.5755 2.15 12.5755 4.79167C12.5755 7.43333 10.4255 9.58333 7.78385 9.58333ZM7.78385 1.25C5.83385 1.25 4.24219 2.84167 4.24219 4.79167C4.24219 6.74167 5.83385 8.33333 7.78385 8.33333C9.73385 8.33333 11.3255 6.74167 11.3255 4.79167C11.3255 2.84167 9.73385 1.25 7.78385 1.25Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M14.9416 17.9167C14.5999 17.9167 14.3166 17.6334 14.3166 17.2917C14.3166 14.4167 11.3834 12.0834 7.78337 12.0834C4.18333 12.0834 1.25 14.4167 1.25 17.2917C1.25 17.6334 0.966667 17.9167 0.625 17.9167C0.283333 17.9167 0 17.6334 0 17.2917C0 13.7334 3.49166 10.8334 7.78337 10.8334C12.075 10.8334 15.5666 13.7334 15.5666 17.2917C15.5666 17.6334 15.2833 17.9167 14.9416 17.9167Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </span>
                                <input
                                  className="tp-input"
                                  type="text"
                                  placeholder="Adult x 1"
                                />
                                <span className="tp-booking-input-angle-icon">
                                  <svg
                                    width={12}
                                    height={7}
                                    viewBox="0 0 12 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.5 0.500045C11.5 0.500045 7.44934 6 6 6C4.55057 6 0.5 0.5 0.5 0.5"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              </div>
                              <div className="tp-booking-quantity-wrap tp-booking-toggle-active">
                                <ul className="tp-booking-quantity-list">
                                  <li>
                                    <div className="tp-booking-quantity-content">
                                      <span>Adult</span>
                                      <p>Ages 13 or adove</p>
                                    </div>
                                    <div className="tp-booking-quantity">
                                      <span className="tp-dreckment">
                                        <svg
                                          width={11}
                                          height={2}
                                          viewBox="0 0 11 2"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 1H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <input
                                        className="tp-input"
                                        type="text"
                                        defaultValue={1}
                                      />
                                      <span className="tp-increment">
                                        <svg
                                          width={11}
                                          height={12}
                                          viewBox="0 0 11 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 6H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M5.5 10.5V1.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="tp-booking-quantity-content">
                                      <span>Children</span>
                                      <p>Ages 2 – 12</p>
                                    </div>
                                    <div className="tp-booking-quantity">
                                      <span className="tp-dreckment">
                                        <svg
                                          width={11}
                                          height={2}
                                          viewBox="0 0 11 2"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 1H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <input
                                        className="tp-input"
                                        type="text"
                                        defaultValue={1}
                                      />
                                      <span className="tp-increment">
                                        <svg
                                          width={11}
                                          height={12}
                                          viewBox="0 0 11 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 6H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M5.5 10.5V1.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="tp-booking-quantity-content">
                                      <span>Infants</span>
                                      <p>Under 2</p>
                                    </div>
                                    <div className="tp-booking-quantity">
                                      <span className="tp-dreckment">
                                        <svg
                                          width={11}
                                          height={2}
                                          viewBox="0 0 11 2"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 1H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <input
                                        className="tp-input"
                                        type="text"
                                        defaultValue={1}
                                      />
                                      <span className="tp-increment">
                                        <svg
                                          width={11}
                                          height={12}
                                          viewBox="0 0 11 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 6H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M5.5 10.5V1.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="tp-booking-quantity-content">
                                      <span>Pets</span>
                                      <p>
                                        <a href="#">Service animal?</a>
                                      </p>
                                    </div>
                                    <div className="tp-booking-quantity">
                                      <span className="tp-dreckment">
                                        <svg
                                          width={11}
                                          height={2}
                                          viewBox="0 0 11 2"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 1H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <input
                                        className="tp-input"
                                        type="text"
                                        defaultValue={1}
                                      />
                                      <span className="tp-increment">
                                        <svg
                                          width={11}
                                          height={12}
                                          viewBox="0 0 11 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1 6H10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M5.5 10.5V1.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="tp-booking-location tp-booking-col-2 mb-15 tp-booking-datepicker p-relative">
                              <div className="tp-booking-location-input tp-booking-toggle p-relative">
                                <span className="tp-booking-input-icon">
                                  <svg
                                    width={18}
                                    height={18}
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14.5385 1.84615H13.3846V0.692308C13.3846 0.310098 13.0745 0 12.6923 0C12.3101 0 12 0.310098 12 0.692308V1.84615H6V0.692308C6 0.310098 5.6899 0 5.30769 0C4.92548 0 4.61538 0.310098 4.61538 0.692308V1.84615H3.46154C1.55319 1.84615 0 3.39934 0 5.30769V14.5385C0 16.4468 1.55319 18 3.46154 18H14.5385C16.4468 18 18 16.4468 18 14.5385V5.30769C18 3.39934 16.4468 1.84615 14.5385 1.84615ZM16.6154 14.5385C16.6154 15.6833 15.6833 16.6154 14.5385 16.6154H3.46154C2.31671 16.6154 1.38462 15.6833 1.38462 14.5385V8.76923H16.6154V14.5385ZM16.6154 7.38462H1.38462V5.30769C1.38462 4.16286 2.31671 3.23077 3.46154 3.23077H4.61538V4.38462C4.61538 4.76682 4.92548 5.07692 5.30769 5.07692C5.6899 5.07692 6 4.76682 6 4.38462V3.23077H12V4.38462C12 4.76682 12.3101 5.07692 12.6923 5.07692C13.0745 5.07692 13.3846 4.76682 13.3846 4.38462V3.23077H14.5385C15.6833 3.23077 16.6154 4.16286 16.6154 5.30769V7.38462ZM8.07692 12.6923C8.07692 12.1825 8.49018 11.7692 9 11.7692C9.50982 11.7692 9.92308 12.1825 9.92308 12.6923C9.92308 13.2021 9.50982 13.6154 9 13.6154C8.49018 13.6154 8.07692 13.2021 8.07692 12.6923ZM11.7692 12.6923C11.7692 12.1825 12.1825 11.7692 12.6923 11.7692C13.2021 11.7692 13.6154 12.1825 13.6154 12.6923C13.6154 13.2021 13.2021 13.6154 12.6923 13.6154C12.1825 13.6154 11.7692 13.2021 11.7692 12.6923ZM4.38462 12.6923C4.38462 12.1825 4.79787 11.7692 5.30769 11.7692C5.81752 11.7692 6.23077 12.1825 6.23077 12.6923C6.23077 13.2021 5.81752 13.6154 5.30769 13.6154C4.79787 13.6154 4.38462 13.2021 4.38462 12.6923Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </span>
                                <input
                                  className="tp-multi-datepicker tp-input"
                                  id="date"
                                  type="text"
                                  name="date"
                                  placeholder="Date"
                                />
                                <span className="tp-booking-input-angle-icon">
                                  <svg
                                    width={12}
                                    height={7}
                                    viewBox="0 0 12 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.5 0.500045C11.5 0.500045 7.44934 6 6 6C4.55057 6 0.5 0.5 0.5 0.5"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                            <button
                              className="tp-btn tp-btn-xl w-100"
                              type="submit"
                            >
                              Check Availability
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="tp-tour-details-info tp-booking-3-sidebar-info">
                        <ul>
                          <li>
                            <span className="tp-booking-3-sidebar-info-icon">
                              <svg
                                width={21}
                                height={21}
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17.4905 17.5H17.5M17.4905 17.5C16.8678 18.1175 15.7393 17.9637 14.9479 17.9637C13.9765 17.9637 13.5087 18.1537 12.8154 18.847C12.2251 19.4374 11.4337 20.5 10.5 20.5C9.5663 20.5 8.7749 19.4374 8.18457 18.847C7.49128 18.1537 7.02349 17.9637 6.05206 17.9637C5.26068 17.9637 4.13218 18.1175 3.50949 17.5C2.88181 16.8776 3.03628 15.7444 3.03628 14.9479C3.03628 13.9414 2.81616 13.4786 2.09938 12.7618C1.03314 11.6956 0.50002 11.1624 0.5 10.5C0.50001 9.8375 1.03312 9.3044 2.09935 8.23817C2.7392 7.59832 3.03628 6.96428 3.03628 6.05206C3.03628 5.26065 2.88249 4.13214 3.5 3.50944C4.12243 2.88178 5.2556 3.03626 6.05208 3.03626C6.96427 3.03626 7.59832 2.7392 8.23815 2.09937C9.3044 1.03312 9.8375 0.5 10.5 0.5C11.1625 0.5 11.6956 1.03312 12.7618 2.09937C13.4015 2.73907 14.0355 3.03626 14.9479 3.03626C15.7393 3.03626 16.8679 2.88247 17.4906 3.5C18.1182 4.12243 17.9637 5.25559 17.9637 6.05206C17.9637 7.05858 18.1839 7.52137 18.9006 8.23817C19.9669 9.3044 20.5 9.8375 20.5 10.5C20.5 11.1624 19.9669 11.6956 18.9006 12.7618C18.1838 13.4786 17.9637 13.9414 17.9637 14.9479C17.9637 15.7444 18.1182 16.8776 17.4905 17.5Z"
                                  stroke="currentColor"
                                />
                                <path
                                  d="M7.5 11.3929C7.5 11.3929 8.7 12.0447 9.3 13C9.3 13 11.1 9.25 13.5 8"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <div className="tp-tour-details-info-content">
                              <h3 className="fw-600 tp-ff-inter mb-0">
                                Free cancellation
                              </h3>
                              <span>
                                Up to 24 hours before the experience starts
                              </span>
                            </div>
                          </li>
                          <li>
                            <span className="tp-booking-3-sidebar-info-icon">
                              <svg
                                width={21}
                                height={21}
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17.4905 17.5H17.5M17.4905 17.5C16.8678 18.1175 15.7393 17.9637 14.9479 17.9637C13.9765 17.9637 13.5087 18.1537 12.8154 18.847C12.2251 19.4374 11.4337 20.5 10.5 20.5C9.5663 20.5 8.7749 19.4374 8.18457 18.847C7.49128 18.1537 7.02349 17.9637 6.05206 17.9637C5.26068 17.9637 4.13218 18.1175 3.50949 17.5C2.88181 16.8776 3.03628 15.7444 3.03628 14.9479C3.03628 13.9414 2.81616 13.4786 2.09938 12.7618C1.03314 11.6956 0.50002 11.1624 0.5 10.5C0.50001 9.8375 1.03312 9.3044 2.09935 8.23817C2.7392 7.59832 3.03628 6.96428 3.03628 6.05206C3.03628 5.26065 2.88249 4.13214 3.5 3.50944C4.12243 2.88178 5.2556 3.03626 6.05208 3.03626C6.96427 3.03626 7.59832 2.7392 8.23815 2.09937C9.3044 1.03312 9.8375 0.5 10.5 0.5C11.1625 0.5 11.6956 1.03312 12.7618 2.09937C13.4015 2.73907 14.0355 3.03626 14.9479 3.03626C15.7393 3.03626 16.8679 2.88247 17.4906 3.5C18.1182 4.12243 17.9637 5.25559 17.9637 6.05206C17.9637 7.05858 18.1839 7.52137 18.9006 8.23817C19.9669 9.3044 20.5 9.8375 20.5 10.5C20.5 11.1624 19.9669 11.6956 18.9006 12.7618C18.1838 13.4786 17.9637 13.9414 17.9637 14.9479C17.9637 15.7444 18.1182 16.8776 17.4905 17.5Z"
                                  stroke="currentColor"
                                />
                                <path
                                  d="M7.5 11.3929C7.5 11.3929 8.7 12.0447 9.3 13C9.3 13 11.1 9.25 13.5 8"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <div className="tp-tour-details-info-content">
                              <h3 className="fw-600 tp-ff-inter mb-0">
                                Reserve Now and Pay Later
                              </h3>
                              <span>
                                Secure your spot while staying flexible
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="tp-booking-sidebar-warning d-flex align-items-start">
                      <span className="tp-tour-details-info-icon">
                        <svg
                          width={22}
                          height={25}
                          viewBox="0 0 22 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.9273 24.5C27.594 20.9 19.3806 6.5 9.40724 0.5C8.23436 4.7 6.47406 5.9 2.95397 10.1C-1.70655 15.6607 0.607402 22.1 7.06063 24.5C6.08288 23.3 3.5595 20.781 5.3 17.3C5.9 16.1 7.1 14.9 6.5 12.5C7.67334 13.1 10.1 13.7 10.7 16.7C11.6778 15.5 12.6925 12.98 11.754 10.1C19.1 15.5 16.1 20.9 12.9273 24.5Z"
                            stroke="#111111"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <div className="tp-tour-details-info-content">
                        <h3 className="fw-600 tp-ff-inter mb-0">Book ahead!</h3>
                        <span>
                          On average, this is booked 16 days in advance.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* tp-tour-details-area-end */}
</>

  );
};

export default TourDetails;
