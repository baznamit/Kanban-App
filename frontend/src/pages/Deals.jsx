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
    DEAL_STAGES.forEach((s) => (map[s.key] = []));
    deals.forEach((d) => map[d.stage]?.push(d));
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

      setDeals((deals) =>
        deals.map((d) => (d.id === dealId ? { ...d, stage: toStage } : d))
      );
    } catch (e) {
      alert("Stage update failed");
    }
  }

  const columns = groupedDeals();

  return (
    <div className="page">
      <h2>Deal Pipeline</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 16 }}>
          {DEAL_STAGES.map((stage) => (
            <Droppable droppableId={stage.key} key={stage.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: 230,
                    minHeight: 420,
                    background: "#f1f3f5",
                    padding: 12,
                    borderRadius: 10,
                    boxShadow: "inset 0 0 0 1px #ddd",
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
                            padding: 10,
                            marginBottom: 10,
                            background: "white",
                            borderRadius: 8,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            fontSize: 14,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <a
                            href={`/deals/${deal.id}/memo`}
                            style={{ textDecoration: "none", color: "#111" }}
                          >
                            <strong
                              style={{ display: "block", marginBottom: 4 }}
                            >
                              {deal.name}
                            </strong>
                          </a>
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
