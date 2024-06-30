import React from 'react';
import { Tabs, Descriptions, Rate, Table } from 'antd';
import PropTypes from 'prop-types';
import { UNIT_MAP, FREQUENCY_MAP, VERACITY_MAP, SDG_INDICATOR_MAP } from '../utils/constants';
import { nullTranslator, firstLetterUppercase } from '../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSeedling } from '@fortawesome/free-solid-svg-icons';

function FileCard({ fileData }) {
    const navigate = useNavigate();
    const curLocation = useLocation();

    const navigateToMetrics = () => {
        navigate("/information/metrics", { state: { referrer: curLocation.pathname } });
    }

    const sdgFooter = () => {
        return <span>More information about the indicators: <a href='https://unstats.un.org/sdgs/iaeg-sdgs/tier-classification' target='_blank' rel="noreferrer">IAEG-SDGs Tier Classification for Global SDG Indicators</a></span>
    }

    const sdfColumns = [
        {
            title: 'Indicator',
            dataIndex: 'indicator',
            key: 'indicator',
            width: 100,d
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
      ];

    const sdgData = fileData.sdg_indicators_e?.map((sdg_indicator, index) => ({
        key: index,
        indicator: sdg_indicator,
        description: SDG_INDICATOR_MAP[sdg_indicator],
        })).sort((a,b) => {
            if (a.indicator > b.indicator) return -1;
            else if (a.indicator < b.indicator) return 1;
            return 0;
        });

    const items = [
        {
            key: '1',
            label: "Metadata - General Information",
            children: 
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Country">
                        {fileData.country.map((country, index) => (
                            <React.Fragment key={country}>
                                <img 
                                    src={`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${country.toUpperCase()}.svg`} 
                                    style={{ height: '3em', verticalAlign: 'middle'}}
                                    alt={country.toUpperCase()}
                                />
                                {index < fileData.country.length - 1 && ' / '}
                            </React.Fragment>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Source">{fileData.source}</Descriptions.Item>
                    <Descriptions.Item label="Frequency">{fileData.frequency ? FREQUENCY_MAP[fileData.frequency.trim()] : "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Unit">{fileData.unit ? UNIT_MAP[fileData.unit.trim()] ? UNIT_MAP[fileData.unit.trim()] : fileData.unit : "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Veracity">{VERACITY_MAP[fileData.veracity]}</Descriptions.Item>
                    <Descriptions.Item label="Data Group">{firstLetterUppercase(fileData.data_group)}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '2',
            label: "Metadata - Dates",
            children: 
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Publish date">{nullTranslator(fileData.publish_date)}</Descriptions.Item>
                    <Descriptions.Item label="Last update date">{nullTranslator(fileData.last_update_date)}</Descriptions.Item>
                    <Descriptions.Item label="Data collection date">{nullTranslator(fileData.data_collection_date)}</Descriptions.Item>
                    <Descriptions.Item label="Track of updates">{nullTranslator(fileData.track_updates)}</Descriptions.Item>
                    <Descriptions.Item label="Delay in Publication">{nullTranslator(fileData.delay_publication)}</Descriptions.Item>
                    <Descriptions.Item label="Delay in Update">{nullTranslator(fileData.delay_update)}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '3',
            label: "Metrics",
            children: 
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Complete Cells">{fileData.available_completeness_cells ? (fileData.available_completeness_cells*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Complete Rows">{fileData.available_completeness_rows ? (fileData.available_completeness_rows*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Consistent Cells">{ fileData.available_consistency_cells ? (fileData.available_consistency_cells*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Consistent Rows">{ fileData.available_consistency_rows ? (fileData.available_consistency_rows*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Accessibility"><Rate value={fileData.accessibility} disabled/>
                        <FontAwesomeIcon icon={faCircleInfo} onClick={() => window.open("https://5stardata.info/en/")} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Retrieval"><Rate value={fileData.retrieval} disabled/>
                        <FontAwesomeIcon icon={faCircleInfo} onClick={() => navigate("/information/five-star-retrieval-difficulty", { state: { referrer: curLocation.pathname } })} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Data coverage period">{parseInt(fileData.chronological_order_start)} - {parseInt(fileData.chronological_order_end)}</Descriptions.Item>
                    <Descriptions.Item label="Access Mechanism">{fileData.access_mechanism}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '4',
            label: 'Data',
            children:
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Data URL">{fileData.data_url ? <a href={fileData.data_url} target='_blank' rel="noreferrer">Link</a> : <span>No link available</span>}</Descriptions.Item>
                    <Descriptions.Item label="Metadata URL">{fileData.metadata_url ? <a href={fileData.metadata_url} target='_blank' rel="noreferrer">Link</a> : <span>No link available</span>}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '5',
            label: <span style={{color: 'green' }}>SDG Indicators <FontAwesomeIcon icon={faSeedling} onClick={navigateToMetrics} style={{ marginLeft: "5px"}} /></span>,
            hidden: !fileData.sdg_indicators_e,
            children:
                <Table
                    columns={sdfColumns}
                    dataSource={sdgData}
                    pagination={false}
                    sticky={true}
                    bordered
                    footer={() => sdgFooter()}
                />
        }
    ].filter(i => !i.hidden)

    return (
        <div style={{ height: '580px', width: '100%' }}>
            <Tabs defaultActiveKey="1" items={items} style={{ height: '100%', overflow: 'auto' }}/>
        </div>
    );
}

FileCard.propTypes = {
    fileData: PropTypes.object
};

export default FileCard;