import { ComponentLoading } from "./OverlayLoading"

export const ReductionGoalBuyInformation = ({goalData}) => {
    console.log('goalData :: ',goalData)
    // if goalData === null ComponentLoading
    return (<ComponentLoading isLoading={goalData===null} size={400}>
    </ComponentLoading>)
}