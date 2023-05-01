import React, { useState, useEffect, useReducer} from "react";
import { Col, Grid, Title, Flex } from "@tremor/react";
import { Badge, BadgeDelta } from "@tremor/react";
import { MultiSelectBox, MultiSelectBoxItem } from "@tremor/react";
import { DateRangePicker } from "@tremor/react";
// import axios from "axios";

// import { Card, Title, BarChart, Subtitle } from "@tremor/react";
// import KpiCard from "./charts/Kpicard";
import Barchart from "./charts/Barchart";
import Donutchart from "./charts/Donutchart";
import CompUIReq from "./charts/Requests";
import CompUITok from "./charts/Tokens";
import reducer from "./reducer";
import { getSubscriptionData, updateDateRange, updateFilters } from "./actions";
import { StatusOnlineIcon } from "@heroicons/react/solid";


function Analytics() {
  const initialState = {
      data: {},
      filters: [
          "Instruct models",
          "Chat models",
          "GPT-4",
          "Fine-tuned models",
          "Embedding models",
          "Image models",
          "Audio models",
      ]

  };
  const [state, dispatch] = useReducer(reducer, initialState);


  const handleUpdateFilters = (value:any) => {
      updateFilters(dispatch, state, value);
  }

  const handleUpdateDateRange = (value:any) => {
      updateDateRange(dispatch, state, value);
  }

  useEffect(() => {
      // This will be called after the component mounts
      getSubscriptionData(dispatch,state);
    }, []);

  //let {filters} = state;
  return (
      <main className="bg-slate-50 p-6 sm:p-10">
          <Flex>
              <Title>OpenAI Analytics</Title>
              <Badge icon={StatusOnlineIcon}>live</Badge>
              <DateRangePicker
                  className="max-w-sm mx-auto"
                  enableDropdown={true}
                  onValueChange={handleUpdateDateRange}
              />
              <MultiSelectBox className="max-w-sm mx-auto space-y-6" onValueChange={handleUpdateFilters}>
                  <MultiSelectBoxItem value="Instruct models" text="Instruct models" />
                  <MultiSelectBoxItem value="Chat models" text="Chat models" />
                  <MultiSelectBoxItem value="GPT-4" text="GPT-4" />
                  <MultiSelectBoxItem value="Fine-tuned models" text="Fine-tuned models" />
                  <MultiSelectBoxItem value="Embedding models" text="Embedding models" />
                  <MultiSelectBoxItem value="Image models" text="Image models" />
                  <MultiSelectBoxItem value="Audio models" text="Audio models" />
              </MultiSelectBox>
          </Flex>
          {<Barchart state={state} dispatch={dispatch} />}
          <Grid numColsLg={3} className="mt-6 gap-6">
              <Col numColSpanLg={1}>
                  <Donutchart state={state} dispatch={dispatch} />
              </Col>
              <Col numColSpanLg={1}>
                  <CompUIReq state={state} dispatch={dispatch} />
              </Col>
              <Col numColSpanLg={1}>
                  <CompUITok state={state} dispatch={dispatch} />
              </Col>
          </Grid>
      </main >
  )
}

export default Analytics