import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export interface HeadingContainerProps {
  subtitle?: string;
  title?: string;
  iconClass?: string;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  showIcon?: boolean;
  // Right-side button
  showBtn?: boolean;
  btnText?: string;
  btnHref?: string;
}

export const HeadingContainer: React.FC<HeadingContainerProps> = ({
  subtitle = "Popular Packages",
  title = "Explore iconic travel.",
  iconClass = "fa-solid fa-star",
  tabs = [],
  activeTab,
  onTabChange,
  showIcon = true,
  showBtn = false,
  btnText = "View All",
  btnHref = "#",
}) => {
  const [currentTab, setCurrentTab] = React.useState<string>(
    activeTab || (tabs.length > 0 ? tabs[0].id : "")
  );

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const hasTabs = tabs && tabs.length > 0;
  const hasRightContent = hasTabs || showBtn;

  return (
    <div className="row align-items-end mb-20">
      <div className={hasRightContent ? "col-xl-6" : "col-12"}>
        <div className="tp-about-section-title p-relative pb-20">
          <span
            className="tp-section-5-subtitle fw-700 d-flex align-items-center mb-25"
          >
            {showIcon && (
              <i className={`${iconClass} mr-10`} style={{ color: "var(--tp-theme-1)" }} />
            )}
            {subtitle}
          </span>
          <h2 className="tp-section-title fw-600 mb-20">
            {title}
          </h2>
          {hasTabs && showBtn && (
            <a href={btnHref} className="tp-btn fw-500 tp-ff-inter">
              {btnText} <i className="fa-solid fa-arrow-right ml-5" />
            </a>
          )}
        </div>
      </div>
      {hasRightContent && (
        <div className="col-xl-6">
          <div className="d-flex justify-content-xl-end align-items-center mb-40">
            {hasTabs ? (
              <div className="tp-tour-tab">
                <ul role="tablist">
                  {tabs.map((tab) => {
                    const isActive = currentTab === tab.id;
                    return (
                      <li className="nav-tab-item" role="presentation" key={tab.id}>
                        <a
                          href={`#${tab.id}`}
                          role="tab"
                          aria-selected={isActive}
                          className={isActive ? "active" : ""}
                          onClick={(e) => handleTabClick(tab.id, e)}
                        >
                          {tab.icon && <i className={`${tab.icon} mr-5`} />}
                          {tab.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              showBtn && (
                <a href={btnHref} className="tp-btn fw-500 tp-ff-inter">
                  {btnText} <i className="fa-solid fa-arrow-right ml-5" />
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadingContainer;
