import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiRequest } from "../api/client";
import { DEAL_STAGES } from "../constants";

export default function Deals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    apiRequest("/deals")
      .then(setDeals)
      .catch(() => (window.location.href = "/"));
  }, []);

  function groupedDeals() {
    const map = {};
    DEAL_STAGES.forEach(s => (map[s.key] = []));
    deals.forEach(d => map[d.stage]?.push(d));
    return map;
  }

  async function onDragEnd(result) {
    if (!result.destination) return;

    const dealId = result.draggableId;
    const toStage = result.destination.droppableId;

    try {
      await apiRequest(
        `/deals/${dealId}/stage?to_stage=${toStage}&actor_id=demo-user`,
        { method: "PATCH" }
      );

      setDeals(deals =>
        deals.map(d =>
          d.id === dealId ? { ...d, stage: toStage } : d
        )
      );
    } catch (e) {
      alert("Stage update failed");
    }
  }

  const columns = groupedDeals();

  return (
    <div style={{ padding: 20 }}>
      <h2>Deal Pipeline</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 16 }}>
          {DEAL_STAGES.map(stage => (
            <Droppable droppableId={stage.key} key={stage.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: 220,
                    minHeight: 400,
                    background: "#e9ecef",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  <h4>{stage.label}</h4>

                  {columns[stage.key].map((deal, index) => (
                    <Draggable
                      draggableId={deal.id}
                      index={index}
                      key={deal.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 8,
                            marginBottom: 8,
                            background: "white",
                            borderRadius: 4,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{deal.name}</strong>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
